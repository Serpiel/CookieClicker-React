import { useState, useEffect } from 'react';

export const useCPS = () => {

  const [, setHistorique] = useState([]); 
  const [cps, setCps] = useState(0);

  const enregistrerClic = () => {

    setHistorique(prev => [...prev, Date.now()]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const maintenant = Date.now();

      setHistorique(anciensClics => {
        const clicsRecents = anciensClics.filter(temps => maintenant - temps <= 1000);
        
        setCps(clicsRecents.length);
        
        return clicsRecents;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return { cps, enregistrerClic };
};