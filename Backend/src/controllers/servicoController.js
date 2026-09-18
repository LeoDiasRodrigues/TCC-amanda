const Servico = require('../models/Servico');

// Listar todos os serviços
exports.listarServicos = async (req, res) => {
    try {
        const servicos = await Servico.find();
        return res.status(200).json(servicos);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao buscar serviços.', erro: error.message });
    }
};

// Criar um novo serviço (usado pelo Admin)
exports.criarServico = async (req, res) => {
    try {
        const { nome, descricao, preco, duracao } = req.body;

        if (!nome || !preco) {
            return res.status(400).json({ mensagem: 'Nome e preço são obrigatórios.' });
        }

        const novoServico = await Servico.create({
            nome,
            descricao,
            preco,
            duracao
        });

        return res.status(201).json(novoServico);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao criar serviço.', erro: error.message });
    }
};

// Atualizar um serviço existente (usado pelo Admin)
exports.atualizarServico = async (req, res) => {
    try {
        const { id } = req.params;
        const servicoAtualizado = await Servico.findByIdAndUpdate(id, req.body, { new: true });

        if (!servicoAtualizado) {
            return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
        }

        return res.status(200).json(servicoAtualizado);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao atualizar serviço.', erro: error.message });
    }
};

// Deletar um serviço (usado pelo Admin)
exports.deletarServico = async (req, res) => {
    try {
        const { id } = req.params;
        const servicoDeletado = await Servico.findByIdAndDelete(id);

        if (!servicoDeletado) {
            return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
        }

        return res.status(200).json({ mensagem: 'Serviço removido com sucesso.' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao deletar serviço.', erro: error.message });
    }
};