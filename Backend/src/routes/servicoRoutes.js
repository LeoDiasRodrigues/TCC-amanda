const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');

// Rota para listar todos os serviços (usada por Clientes e Admin)
router.get('/', servicoController.listarServicos);

// Rota para criar um novo serviço (Admin)
router.post('/', servicoController.criarServico);

// Rota para atualizar um serviço pelo ID (Admin)
router.put('/:id', servicoController.atualizarServico);

// Rota para deletar um serviço pelo ID (Admin)
router.delete('/:id', servicoController.deletarServico);

module.exports = router;