// Serveur minimal pour le bandeau ZEvent : sert la page overlay.html et un
// petit endpoint /info qui liste le contenu a afficher. Volontairement
// simple pour l'instant (pas de chat/TTS/emotes, contrairement au bandeau de
// stream habituel) -- l'idee est de garder une base facile a etendre quand
// on ajoutera les dons en direct, les raids, les objectifs de dons et les
// associations.

const express = require('express');
const path = require('path');
const { getInfoItems } = require('./info');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/info', (req, res) => {
  res.json({ items: getInfoItems() });
});

app.listen(PORT, () => {
  console.log(`Bandeau ZEvent en ecoute sur le port ${PORT}`);
});
