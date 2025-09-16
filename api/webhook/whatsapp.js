const express = require('express');
const router = express.Router();

const WEBHOOK_VERIFY_TOKEN = import.meta.env.VITE_WEBHOOK_VERIFY_TOKEN;

// Verificação do webhook (GET)
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(WEBHOOK_VERIFY_TOKEN);
  console.log(token);
  console.log(mode);
  console.log(challenge);

  if (mode && token) {
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Receber mensagens (POST)
router.post('/whatsapp', (req, res) => {
  const body = req.body;

  if (body.object) {
    if (body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]) {
      
      // Processar mensagem recebida
      const message = body.entry[0].changes[0].value.messages[0];
      console.log('Mensagem recebida:', message);
      
      // Aqui você pode processar a mensagem e notificar o frontend
      // via WebSocket, Server-Sent Events, ou polling
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;