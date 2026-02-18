import React, { useState, useEffect, useRef } from 'react'; // NOUVEAU : On importe useRef
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

export default function Game({ username, onLogout }) {
  
  const [cookies, setCookies] = useState(() => {
    return parseFloat(localStorage.getItem(`cc_cookies_${username}`)) || 0;
  });

  const [productionAuto, setProductionAuto] = useState(() => {
    return parseFloat(localStorage.getItem(`cc_auto_${username}`)) || 0;
  });

  const [multiplicateur, setMultiplicateur] = useState(() => {
    return parseFloat(localStorage.getItem(`cc_mult_${username}`)) || 1;
  });

  const [ameliorations, setAmeliorations] = useState(() => {
    const saved = localStorage.getItem(`cc_upgrades_${username}`);
    return saved ? JSON.parse(saved) : INITIAL_UPGRADES;
  });

  const { cps, enregistrerClic } = useCPS();

  const cookiesParSeconde = productionAuto * multiplicateur;
  const coutMultiplicateur = 50 * Math.pow(1.5, multiplicateur - 1);

  // --- NOUVEAU : PRÉPARATION DE LA SAUVEGARDE CLOUD (MONGODB) ---
  
  // 1. On crée une référence qui stocke toujours le dernier score de cookies
  const cookiesRef = useRef(cookies);
  
  useEffect(() => {
    cookiesRef.current = cookies;
  }, [cookies]);

  // 2. Le minuteur qui envoie le score au back-end toutes les 10 secondes
  useEffect(() => {
    if (!username) return;

    const intervalId = setInterval(async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        await fetch(`${apiUrl}/api/update-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: username, 
            cookies: cookiesRef.current 
          })
        });

        console.log(`💾 Cloud Save : ${cookiesRef.current} cookies sauvegardés dans MongoDB !`);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde cloud :", error);
      }
    }, 10000); // 10000 ms = 10 secondes (tu pourras passer à 30000 quand tout marchera bien)

    return () => clearInterval(intervalId);
  }, [username]);
  // --------------------------------------------------------------

  // Sauvegarde locale classique (localStorage)
  useEffect(() => {
    localStorage.setItem(`cc_cookies_${username}`, cookies);
    localStorage.setItem(`cc_auto_${username}`, productionAuto);
    localStorage.setItem(`cc_mult_${username}`, multiplicateur);
    localStorage.setItem(`cc_upgrades_${username}`, JSON.stringify(ameliorations));
  }, [cookies, productionAuto, multiplicateur, ameliorations, username]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cookiesParSeconde > 0) setCookies(c => c + cookiesParSeconde);
    }, 1000);
    return () => clearInterval(interval);
  }, [cookiesParSeconde]);

  const ajouterCookies = () => {
    setCookies(c => c + (1 * multiplicateur));
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

  return (
    <>
      <header className="header-stats">
        <div className="user-info">
           <span>Joueur: <strong>{username}</strong></span>
           <button onClick={onLogout} className="logout-btn">Quitter</button>
        </div>
        
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
            upgrades={ameliorations} buyUpgrade={acheterAmelioration}
            cookies={cookies} buyMultiplier={acheterMultiplicateur} multiplierCost={coutMultiplicateur}
          />
        </div>
      </div>
    </>
  );
}