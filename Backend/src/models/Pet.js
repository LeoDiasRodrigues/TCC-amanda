const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },

    especie: {
      type: String,
      required: true,
      trim: true
    },

    raca: {
      type: String,
      required: true,
      trim: true
    },

    idade: {
      type: Number,
      default: 0
    },

    // ID do cliente dono do pet
    clienteId: {
      type: String,
      required: true,
      trim: true
    },

    // Mantemos dono também para não quebrar
    // os pets que já existem no sistema
    dono: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Pet", petSchema);
