const express = require("express");

const router = express.Router();

const {
  listarAgendamentos,
  cadastrarAgendamento,
  editarAgendamento,
  removerAgendamento
} = require("../controllers/agendamentoController");

// =====================================
// LISTAR AGENDAMENTOS
// =====================================
router.get("/", listarAgendamentos);

// =====================================
// CADASTRAR AGENDAMENTO
// =====================================
router.post("/", cadastrarAgendamento);

// =====================================
// EDITAR AGENDAMENTO
// =====================================
router.put("/:id", editarAgendamento);

// =====================================
// REMOVER AGENDAMENTO
// =====================================
router.delete("/:id", removerAgendamento);

module.exports = router;
