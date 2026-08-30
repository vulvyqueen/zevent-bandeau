// Serveur pour le bandeau ZEvent : sert overlay.html, l'endpoint /info (contenu
// tournant), un serveur WebSocket temps reel pour les alertes en direct, un
// endpoint /message securise (utilise par Mix It Up pour les messages
// epingles des modos et les recompenses de points de chaine), et une
// connexion directe a l'API Socket de Streamlabs pour les alertes de dons
// ZEvent (avec le message du donateur).

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

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/info', (req, res) => {
  res.json({ items: getInfoItems() });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

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

// Alertes de dons ZEvent : connexion directe a l'API Socket de Streamlabs.
function connectStreamlabs() {
  if (!STREAMLABS_SOCKET_TOKEN) {
    console.log('STREAMLABS_SOCKET_TOKEN absent : alertes de dons desactivees.');
    return;
  }
  const socket = ioClient('https://sockets.streamlabs.com?token=' + STREAMLABS_SOCKET_TOKEN, {
    transports: ['websocket'],
  });

socket.on('connect', () => {
  console.log('Connecte a Streamlabs : alertes de dons actives.');
});
  socket.on('disconnect', () => {
    console.log('Deconnecte de Streamlabs, tentative de reconnexion automatique...');
  });
  socket.on('error', (err) => {
    console.error('Erreur socket Streamlabs', err);
  });

socket.on('event', (eventData) => {
  if (!eventData || eventData.type !== 'donation') return;
  const donations = Array.isArray(eventData.message) ? eventData.message : [eventData.message];
  donations.forEach((don) => {
    if (!don) return;
    broadcast({
      id: crypto.randomUUID(),
      kind: 'donation',
      author: (don.name || 'Anonyme').toString().slice(0, 40),
      amount: (don.formatted_amount || ((don.amount || '') + ' ' + (don.currency || ''))).toString().trim(),
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
