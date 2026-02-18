import { useState } from 'react';

// On passe 'onLogin' en paramètre pour que le hook puisse déclencher la connexion
export const useAuth = (onLogin) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError('');

    if (!username || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // On définit l'URL en fonction du mode (Connexion ou Inscription)
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const endpoint = isLoginMode ? '/api/login' : '/api/register';

    try {
      // On envoie les données à ton serveur Node.js
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si le serveur dit que c'est bon (statut 200 ou 201), on connecte le joueur !
        // Ça marche aussi bien pour la connexion que juste après une inscription.
        onLogin(username);
      } else {
        // S'il y a une erreur (ex: mauvais mot de passe, ou pseudo déjà pris)
        setError(data.message || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur de jeu.");
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(''); // On efface les erreurs quand on change d'onglet
  };

  // On renvoie tout ce dont la vue aura besoin pour fonctionner
  return {
    isLoginMode,
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSubmit,
    toggleMode
  };
};