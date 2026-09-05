// Serveur pour le bandeau ZEvent : sert overlay.html, l'endpoint /info (contenu
// tournant), un serveur WebSocket temps reel pour les alertes en direct, un
// endpoint /message securise (utilise par Mix It Up pour les messages
// epingles des modos et les recompenses de points de chaine), et une
// connexion directe a l'API Socket de Streamlabs pour les alertes de dons
// ZEvent Charity uniquement (dons recus sur l'espace personnel ZEvent).

require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');
const ioClient = require('socket.io-client');
const { getInfoItems } = require('./info');

const app = express();
const PORT = process.env.PORT || 10000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const STREAMLABS_SOCKET_TOKEN = process.env.STREAMLABS_SOCKET_TOKEN;
const MAX_TEXT_LENGTH = 300;

// Dons ZEvent Charity reinjectes manuellement (historique recupere depuis
// Streamlabs > Evenements recents : ces dons ne sont pas persistes cote
// serveur). Rejoues a chaque connexion WebSocket pour survivre aux
// redemarrages (veille Render, redeploiement...). Les ids fixes evitent les
// doublons cote client si une meme page se reconnecte plusieurs fois.
const SEED_DONATIONS = [
  { id: 'seed-1', author: 'xaxax', amount: '€15.00', text: '' },
  { id: 'seed-2', author: 'SkYl0r', amount: '€10.00', text: 'Je suis encore la...' },
  { id: 'seed-3', author: 'SkYl0r', amount: '€15.00', text: 'voila' },
  { id: 'seed-4', author: 'SkYl0r', amount: '€200.00', text: "C'est repartie pour la pomme ?" },
  { id: 'seed-5', author: 'Jacques Chirac', amount: '€200.00', text: 'Mangez des pommes !!!' },
  { id: 'seed-6', author: 'Huns', amount: '€500.00', text: 'POUR LA DEEEEEEER' },
  { id: 'seed-7', author: 'SkYl0r', amount: '€150.00', text: '....' },
  { id: 'seed-8', author: 'Elooo <3', amount: '€100.00', text: '' },
  { id: 'seed-9', author: 'cocaplie', amount: '€5.00', text: 'courage ma belle' },
  { id: 'seed-10', author: 'k_psul', amount: '€1.67', text: "L'armee des 1, je suce des cailloux sur un coulis d'eau minerale, le grand luxe" },
  ];

function replaySeedDonations(client) {
  SEED_DONATIONS.forEach((don, i) => {
    setTimeout(() => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          id: don.id,
          kind: 'donation',
          author: don.author,
          amount: don.amount,
          text: don.text,
          ts: Date.now(),
        }));
      }
    }, i * 80);
  });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/info', (req, res) => {
  res.json({ items: getInfoItems() });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (client) => {
  replaySeedDonations(client);
});

function broadcast(payload) {
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
}

// Messages Mix It Up : pins des modos et recompenses de points de chaine.
app.post('/message', (req, res) => {
  const token = req.header('X-Auth-Token') || (req.body && req.body.token);
  if (!AUTH_TOKEN || token !== AUTH_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const { text, type = 'chat', author = '' } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: 'text too long' });
  }
  const message = {
    id: crypto.randomUUID(),
    kind: 'message',
    text: text.trim(),
    type,
    author: String(author || '').trim().slice(0, 40),
    ts: Date.now(),
  };
  broadcast(message);
  res.json({ ok: true, id: message.id });
});

// Alertes de dons ZEvent Charity : connexion directe a l'API Socket de
// Streamlabs. On n'ecoute QUE l'evenement "streamlabscharitydonation"
// (dons recus via l'espace personnel ZEvent), pas les dons Streamlabs
// classiques hors ZEvent.
function connectStreamlabs() {
  if (!STREAMLABS_SOCKET_TOKEN) {
    console.log('STREAMLABS_SOCKET_TOKEN absent : alertes de dons desactivees.');
    return;
  }
  const socket = ioClient('https://sockets.streamlabs.com?token=' + STREAMLABS_SOCKET_TOKEN, {
    transports: ['websocket'],
  });

socket.on('connect', () => {
  console.log('Connecte a Streamlabs : alertes de dons ZEvent Charity actives.');
});
  socket.on('disconnect', () => {
    console.log('Deconnecte de Streamlabs, tentative de reconnexion automatique...');
  });
  socket.on('error', (err) => {
    console.error('Erreur socket Streamlabs', err);
  });

socket.on('event', (eventData) => {
  if (!eventData || eventData.type !== 'streamlabscharitydonation') return;
  const donations = Array.isArray(eventData.message) ? eventData.message : [eventData.message];
  donations.forEach((don) => {
    if (!don) return;
    broadcast({
      id: crypto.randomUUID(),
      kind: 'donation',
      author: (don.from || 'Anonyme').toString().slice(0, 40),
      amount: (don.formattedAmount || don.formatted_amount || ((don.amount || '') + ' ' + (don.currency || ''))).toString().trim(),
      text: (don.message || '').toString().slice(0, 200),
      ts: Date.now(),
    });
  });
});
}

connectStreamlabs();

server.listen(PORT, () => {
  console.log('Bandeau ZEvent en ecoute sur le port ' + PORT);
});
