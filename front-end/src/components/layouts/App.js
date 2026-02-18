import React, { useState } from 'react';
import '../styles/App.css';
import Auth from './Auth';
import Game from './Game';

export default function App() {
  // Le state qui retient qui est connecté. null = personne n'est connecté.
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="App">
      {/* Rendu conditionnel : Si pas d'utilisateur, on affiche le composant de connexion */}
      {!currentUser ? (
        <Auth onLogin={setCurrentUser} />
      ) : (
        /* Sinon, on affiche le jeu et on lui passe le nom du joueur */
        <Game username={currentUser} onLogout={() => setCurrentUser(null)} />
      )}
    </div>
  );
}