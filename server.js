require('dotenv').config();
const dns = require('dns');

// Força o uso do DNS do Google/Cloudflare, pois o DNS automático
// da rede (ex: hotspot 4G) não resolve corretamente consultas SRV
// usadas pela string de conexão "mongodb+srv://"
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const demandaRoutes = require('./src/routes/DemandaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', demandaRoutes);

// Rota de teste
app.get('/teste', (req, res) => {
  res.json({ mensagem: "Olá! O Back-end e a Base de Dados estão vivos!" });
});

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🍃 Base de dados MongoDB ligada com sucesso!'))
  .catch((erro) => {
    console.error('❌ Erro ao ligar ao MongoDB:', erro.message);
    console.error('   Verifique: 1) a string MONGODB_URI no .env, 2) se o IP está liberado no Network Access do Atlas, 3) sua conexão de internet/DNS.');
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor a correr na porta ${PORT}`);
});