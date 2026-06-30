const mongoose = require('mongoose');

const DemandaSchema = new mongoose.Schema({
  assunto: {
    type: String,
    required: false,
    trim: true
  },
  descricao: {
    type: String,
    required: false,
    trim: true
  },
  endereco: {
    type: String,
    required: false,
    trim: true
  },
  nivelUrgencia: {
    type: String,
    required: false,
    enum: ['Baixa', 'Normal', 'Urgente', 'Muito Urgente'],
    default: 'Normal'
  },
  nomeMunicipe: {
    type: String,
    required: false,
    trim: true
  },
  contato: {
    type: String,
    required: false,
    trim: true
  },
  dataContato: {
    type: String, // mantido como String por enquanto (formato dd/mm/aaaa vindo do front)
    required: false
  },
  secretariaSetor: {
    type: String,
    required: false,
    trim: true
  },
  status: {
    type: String,
    required: false,
    enum: ['Pendente', 'Em andamento', 'Concluída', 'Cancelada'],
    default: 'Pendente'
  },
  // Soft delete: a demanda nunca é apagada de verdade, só "ocultada"
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // cria createdAt e updatedAt automaticamente
});

// Índice de texto para permitir busca livre por assunto, descrição e munícipe
DemandaSchema.index({
  assunto: 'text',
  descricao: 'text',
  nomeMunicipe: 'text',
  endereco: 'text'
});

// Índices simples para acelerar filtros comuns
DemandaSchema.index({ ativo: 1 });
DemandaSchema.index({ nivelUrgencia: 1 });
DemandaSchema.index({ secretariaSetor: 1 });
DemandaSchema.index({ status: 1 });

const Demanda = mongoose.model('Demanda', DemandaSchema);
module.exports = Demanda;