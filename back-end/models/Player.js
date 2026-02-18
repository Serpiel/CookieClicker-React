const mongoose = require('mongoose');

// 1. On définit le "plan" (Schéma) d'un joueur
const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Le pseudo est obligatoire
    unique: true    // Deux joueurs ne peuvent pas avoir le même pseudo
  },
  password: {
    type: String,
    required: true
  },
  cookies: {
    type: Number,
    default: 0      // Par défaut, un nouveau joueur commence à 0 cookie
  }
}, { 
  timestamps: true // Ajoute automatiquement la date de création (createdAt) et de dernière modification (updatedAt)
});

// 2. On transforme ce schéma en Modèle utilisable
const Player = mongoose.model('Player', playerSchema);

// 3. On l'exporte pour pouvoir l'utiliser ailleurs dans notre code
module.exports = Player;