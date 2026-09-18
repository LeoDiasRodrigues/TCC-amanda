const Agendamento = require("../models/Agendamento");

// =====================================
// LISTAR AGENDAMENTOS
// =====================================
async function listarAgendamentos(req, res) {
  try {
    const agendamentos = await Agendamento.find()
      .sort({ data: 1, horario: 1 });

    res.json(agendamentos);

  } catch (error) {
    console.error(
      "Erro ao listar agendamentos:",
      error
    );

    res.status(500).json({
      mensagem: "Erro ao buscar agendamentos"
    });
  }
}


// =====================================
// CADASTRAR AGENDAMENTO
// =====================================
async function cadastrarAgendamento(req, res) {
  try {

    console.log(
      "================================="
    );

    console.log(
      "DADOS RECEBIDOS NO BACKEND:"
    );

    console.log(req.body);

    console.log(
      "clienteId recebido:",
      req.body.clienteId
    );

    console.log(
      "================================="
    );


    const {
      pet,
      servico,
      data,
      horario,
      status,
      clienteId
    } = req.body;


    // =====================================
    // VALIDAR CAMPOS
    // =====================================

    if (
      !pet ||
      !servico ||
      !data ||
      !horario ||
      !clienteId
    ) {

      return res.status(400).json({
        mensagem:
          "Pet, serviço, data, horário e clienteId são obrigatórios."
      });

    }


    // =====================================
    // VERIFICAR HORÁRIO
    // =====================================

    const horarioOcupado =
      await Agendamento.findOne({
        data: data,
        horario: horario
      });


    if (horarioOcupado) {

      return res.status(409).json({
        mensagem:
          "Este horário já está ocupado. Escolha outro horário."
      });

    }


    // =====================================
    // CRIAR AGENDAMENTO
    // =====================================

    const novoAgendamento =
      await Agendamento.create({

        pet: pet,

        servico: servico,

        data: data,

        horario: horario,

        // MUITO IMPORTANTE
        clienteId: String(clienteId),

        status:
          status || "Pendente"

      });


    console.log(
      "AGENDAMENTO CRIADO:"
    );

    console.log(
      novoAgendamento
    );


    res.status(201).json(
      novoAgendamento
    );


  } catch (error) {

    console.error(
      "Erro ao cadastrar agendamento:",
      error
    );

    res.status(500).json({
      mensagem:
        "Erro ao cadastrar agendamento."
    });

  }
}


// =====================================
// EDITAR AGENDAMENTO
// =====================================
async function editarAgendamento(req, res) {

  try {

    const { id } = req.params;

    const {
      pet,
      servico,
      data,
      horario,
      status,
      clienteId
    } = req.body;


    if (
      !pet ||
      !servico ||
      !data ||
      !horario ||
      !clienteId
    ) {

      return res.status(400).json({
        mensagem:
          "Pet, serviço, data, horário e clienteId são obrigatórios."
      });

    }


    // =====================================
    // VERIFICAR HORÁRIO
    // =====================================

    const horarioOcupado =
      await Agendamento.findOne({

        data: data,

        horario: horario,

        _id: {
          $ne: id
        }

      });


    if (horarioOcupado) {

      return res.status(409).json({
        mensagem:
          "Este horário já está ocupado. Escolha outro horário."
      });

    }


    // =====================================
    // ATUALIZAR
    // =====================================

    const agendamentoAtualizado =
      await Agendamento.findByIdAndUpdate(

        id,

        {
          pet,
          servico,
          data,
          horario,
          clienteId: String(clienteId),
          status
        },

        {
          new: true,
          runValidators: true
        }

      );


    if (!agendamentoAtualizado) {

      return res.status(404).json({
        mensagem:
          "Agendamento não encontrado."
      });

    }


    res.json(
      agendamentoAtualizado
    );


  } catch (error) {

    console.error(
      "Erro ao editar agendamento:",
      error
    );

    res.status(500).json({
      mensagem:
        "Erro ao editar agendamento."
    });

  }
}


// =====================================
// REMOVER AGENDAMENTO
// =====================================
async function removerAgendamento(req, res) {

  try {

    const { id } = req.params;


    const agendamentoRemovido =
      await Agendamento.findByIdAndDelete(
        id
      );


    if (!agendamentoRemovido) {

      return res.status(404).json({
        mensagem:
          "Agendamento não encontrado."
      });

    }


    res.json({
      mensagem:
        "Agendamento removido com sucesso."
    });


  } catch (error) {

    console.error(
      "Erro ao remover agendamento:",
      error
    );

    res.status(500).json({
      mensagem:
        "Erro ao remover agendamento."
    });

  }
}


module.exports = {
  listarAgendamentos,
  cadastrarAgendamento,
  editarAgendamento,
  removerAgendamento
};
