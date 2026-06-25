require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); // Permite que a API receba dados em JSON do Postman

// Nossa rota de teste para o Postman
app.get('/teste', (req, res) => {
  res.json({ mensagem: "Back está ok" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});