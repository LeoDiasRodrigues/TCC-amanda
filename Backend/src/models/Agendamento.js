const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema(
  {
    pet: {
      type: String,
      required: true
    },

    servico: {
      type: String,
      required: true
    },

    data: {
      type: String,
      required: true
    },

    horario: {
      type: String,
      required: true
    },

    clienteId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Pendente",
        "Confirmado",
        "Finalizado"
      ],
      default: "Pendente"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Agendamento",
    agendamentoSchema
  );
