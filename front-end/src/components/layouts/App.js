import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import Stats from '../features/Stats';
import ClickArea from '../features/ClickArea';
import UpgradeList from '../features/UpgradeList';
import { useCPS } from '../features/CalcCPS';

const INITIAL_UPGRADES = [
  { id: 1, name: "Grand-mère", baseCost: 10, production: 1, count: 0, currentCost: 10 },
  { id: 2, name: "Ferme", baseCost: 100, production: 5, count: 0, currentCost: 100 },
  { id: 3, name: "Usine", baseCost: 500, production: 20, count: 0, currentCost: 500 },
  { id: 4, name: "Mine", baseCost: 2000, production: 50, count: 0, currentCost: 2000 },
];

export default function App() {
  // --- STATES ---
  const [cookies, setCookies] = useState(() => {
    return parseFloat(localStorage.getItem('cc_cookies')) || 0;
  });

  const [productionAuto, setProductionAuto] = useState(() => {
    return parseFloat(localStorage.getItem('cc_auto')) || 0;
  });

  const [multiplicateur, setMultiplicateur] = useState(() => {
    return parseFloat(localStorage.getItem('cc_mult')) || 1;
  });

  const [ameliorations, setAmeliorations] = useState(() => {
    const saved = localStorage.getItem('cc_upgrades');
    return saved ? JSON.parse(saved) : INITIAL_UPGRADES;
  });

  // Utilisation du Hook personnalisé pour le CPS
  const { cps, enregistrerClic } = useCPS();

  // --- VALEURS CALCULÉES ---
  const cookiesParSeconde = productionAuto * multiplicateur;
  const coutMultiplicateur = 50 * Math.pow(1.5, multiplicateur - 1);

  // --- EFFECTS ---
  
  // 1. Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem('cc_cookies', cookies);
    localStorage.setItem('cc_auto', productionAuto);
    localStorage.setItem('cc_mult', multiplicateur);
    localStorage.setItem('cc_upgrades', JSON.stringify(ameliorations));
  }, [cookies, productionAuto, multiplicateur, ameliorations]);

  // 2. Production Automatique (Timer)
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookiesParSeconde > 0) {
        setCookies(c => c + cookiesParSeconde);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cookiesParSeconde]);

  // --- HANDLERS ---
  
  const ajouterCookies = () => {
    setCookies(c => c + (1 * multiplicateur));
    // Appel au hook pour compter le clic
    enregistrerClic();
  };

  const acheterMultiplicateur = () => {
    if (cookies >= coutMultiplicateur) {
      setCookies(c => c - coutMultiplicateur);
      setMultiplicateur(m => m + 1);
    }
  };

  const acheterAmelioration = (id) => {
    const index = ameliorations.findIndex(u => u.id === id);
    const item = ameliorations[index];

    if (cookies >= item.currentCost) {
      setCookies(c => c - item.currentCost);
      setProductionAuto(p => p + item.production);

      const newUpgrades = [...ameliorations];
      newUpgrades[index] = {
        ...item,
        count: item.count + 1,
        currentCost: item.baseCost * Math.pow(1.15, item.count + 1)
      };
      setAmeliorations(newUpgrades);
    }
  };

  // --- RENDU ---
  return (
    <div className="App">
      <header className="header-stats">
        <Stats 
          cookies={cookies} 
          productionAuto={productionAuto} 
          multiplicateur={multiplicateur}
          cpsManuel={cps} 
        />
      </header>

      <div className="game-layout">
        <div className="left-panel">
          <ClickArea onClick={ajouterCookies} cookies={cookies} />
        </div>

        <div className="right-panel">
          <UpgradeList 
            upgrades={ameliorations} 
            buyUpgrade={acheterAmelioration}
            cookies={cookies}
            buyMultiplier={acheterMultiplicateur}
            multiplierCost={coutMultiplicateur}
          />
        </div>
      </div>
    </div>
  );
}