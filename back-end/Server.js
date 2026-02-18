require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const Player = require('./models/Player');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL)
  .then(() => {
    console.log('✅ Connexion à MongoDB Atlas réussie !');
    app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
  })
  .catch((erreur) => console.error('❌ Erreur MongoDB :', erreur.message));

// --- INSCRIPTION (HASHAGE) ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingPlayer = await Player.findOne({ username });
    if (existingPlayer) return res.status(400).json({ message: "Ce pseudo est déjà pris !" });

    // 2. Hacher le mot de passe (10 est le "salt rounds" ou niveau de complexité)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPlayer = new Player({ 
      username: username, 
      password: hashedPassword // On enregistre le hash, pas le texte clair !
    });

    await newPlayer.save();
    res.status(201).json({ message: "Compte créé avec succès !" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

// --- CONNEXION (VÉRIFICATION) ---
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const player = await Player.findOne({ username });

    // 3. Comparer le mot de passe tapé avec le hash dans la BDD
    if (!player) {
        return res.status(400).json({ message: "Utilisateur non trouvé." });
    }

    const isMatch = await bcrypt.compare(password, player.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    res.status(200).json({ 
      message: "Connexion réussie !", 
      username: player.username,
      cookies: player.cookies 
    });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

app.post('/api/update-score', async (req, res) => {
    try {
      const { username, cookies } = req.body;
      await Player.findOneAndUpdate({ username }, { cookies });
      res.status(200).json({ message: "Score sauvegardé !" });
    } catch (erreur) {
      res.status(500).json({ message: "Erreur sauvegarde." });
    }
});