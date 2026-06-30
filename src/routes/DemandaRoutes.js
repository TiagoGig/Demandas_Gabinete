const express = require('express');
const router = express.Router();
const demandaController = require('../controllers/DemandaController');

// Criar nova demanda
router.post('/demandas', demandaController.criarDemanda);

// Listar demandas (aceita query params: ativo, nivelUrgencia, secretariaSetor, status, busca, pagina, limite)
router.get('/demandas', demandaController.listarDemandas);

// Buscar uma demanda específica por ID
router.get('/demandas/:id', demandaController.buscarDemandaPorId);

// Editar/atualizar uma demanda
router.put('/demandas/:id', demandaController.atualizarDemanda);

// Ocultar (soft delete) uma demanda
router.patch('/demandas/:id/ocultar', demandaController.ocultarDemanda);

// Desocultar (restaurar) uma demanda
router.patch('/demandas/:id/desocultar', demandaController.desocultarDemanda);

// Excluir definitivamente uma demanda
router.delete('/demandas/:id', demandaController.deletarDemanda);

module.exports = router;