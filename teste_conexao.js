require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');

console.log('Tentando conectar...');
console.log('URI (parcial):', process.env.MONGODB_URI?.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
})
  .then(() => {
    console.log('✅ CONECTOU COM SUCESSO!');
    process.exit(0);
  })
  .catch((erro) => {
    console.error('❌ FALHOU:', erro.message);
    process.exit(1);
  });