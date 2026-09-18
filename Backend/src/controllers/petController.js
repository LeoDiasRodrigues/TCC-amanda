const Pet = require("../models/Pet");
const Cliente = require("../models/Cliente");

// =====================================
// LISTAR PETS
// =====================================
async function listarPets(req, res) {
  try {
    const pets = await Pet.find()
      .sort({ createdAt: -1 })
      .lean();

    const petsComNome = await Promise.all(
      pets.map(async (pet) => {
        const cliente = await Cliente.findById(
          pet.dono
        ).lean();

        return {
          ...pet,

          nomeDono: cliente
            ? cliente.nome || cliente.email
            : "Cliente não encontrado"
        };
      })
    );

    res.status(200).json(petsComNome);

  } catch (error) {
    console.error(
      "Erro ao listar pets:",
      error
    );

    res.status(500).json({
      mensagem: "Erro ao buscar pets"
    });
  }
}


// =====================================
// CADASTRAR PET
// =====================================
async function cadastrarPet(req, res) {
  try {
    const {
      nome,
      especie,
      raca,
      idade,
      clienteId,
      dono
    } = req.body;

    if (!nome || !especie || !raca) {
      return res.status(400).json({
        mensagem:
          "Nome, espécie e raça são obrigatórios."
      });
    }

    const idCliente =
      clienteId || dono;

    if (!idCliente) {
      return res.status(400).json({
        mensagem:
          "O cliente dono do pet não foi informado."
      });
    }

    const novoPet = await Pet.create({
      nome,
      especie,
      raca,

      idade: idade
        ? Number(idade)
        : 0,

      clienteId: String(idCliente),

      dono: String(idCliente)
    });

    res.status(201).json(novoPet);

  } catch (error) {
    console.error(
      "Erro ao cadastrar pet:",
      error
    );

    res.status(500).json({
      mensagem:
        "Erro ao cadastrar pet."
    });
  }
}


// =====================================
// EDITAR PET
// =====================================
async function editarPet(req, res) {
  try {
    const { id } = req.params;

    const {
      nome,
      especie,
      raca,
      idade,
      clienteId,
      dono
    } = req.body;

    if (!nome || !especie || !raca) {
      return res.status(400).json({
        mensagem:
          "Nome, espécie e raça são obrigatórios."
      });
    }

    const petAtual =
      await Pet.findById(id);

    if (!petAtual) {
      return res.status(404).json({
        mensagem:
          "Pet não encontrado."
      });
    }

    const idCliente =
      clienteId ||
      dono ||
      petAtual.clienteId ||
      petAtual.dono;

    const petAtualizado =
      await Pet.findByIdAndUpdate(
        id,

        {
          nome,
          especie,
          raca,

          idade: idade
            ? Number(idade)
            : 0,

          clienteId:
            String(idCliente),

          dono:
            String(idCliente)
        },

        {
          new: true,
          runValidators: true
        }
      );

    res.status(200).json(
      petAtualizado
    );

  } catch (error) {
    console.error(
      "Erro ao editar pet:",
      error
    );

    res.status(500).json({
      mensagem:
        "Erro ao editar pet."
    });
  }
}


// =====================================
// REMOVER PET
// =====================================
async function removerPet(req, res) {
  try {
    const { id } = req.params;

    const petRemovido =
      await Pet.findByIdAndDelete(id);

    if (!petRemovido) {
      return res.status(404).json({
        mensagem:
          "Pet não encontrado."
      });
    }

    res.status(200).json({
      mensagem:
        "Pet removido com sucesso."
    });

  } catch (error) {
    console.error(
      "Erro ao remover pet:",
      error
    );

    res.status(500).json({
      mensagem:
        "Erro ao remover pet."
    });
  }
}


// =====================================
// EXPORTAR
// =====================================
module.exports = {
  listarPets,
  cadastrarPet,
  editarPet,
  removerPet
};
