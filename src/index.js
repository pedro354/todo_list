const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Vercel!');
});

app.get('*', (req, res) => {
  res.status(404).send('Rota não encontrada');
});

module.exports = app;