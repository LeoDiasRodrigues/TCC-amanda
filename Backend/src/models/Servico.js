const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'O nome do serviço é obrigatório.'],
            trim: true
        },
        descricao: {
            type: String,
            trim: true
        },
        preco: {
            type: Number,
            required: [true, 'O preço é obrigatório.']
        },
        duracao: {
            type: Number, // Duração estimada em minutos (ex: 30, 60, 90)
            default: 30
        }
    },
    {
        timestamps: true // Adiciona automaticamente os campos createdAt e updatedAt
    }
);

module.exports = mongoose.model('Servico', ServicoSchema);