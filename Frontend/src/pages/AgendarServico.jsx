import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AgendarServico() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentosExistentes, setAgendamentosExistentes] = useState([]);

  const [petSelecionado, setPetSelecionado] = useState("");
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  const clienteId =
    localStorage.getItem("clienteId") || "";

  const dataHoje =
    new Date().toISOString().split("T")[0];

  const horariosFuncionamento = [
    "08:00", "08:20", "08:40",
    "09:00", "09:20", "09:40",
    "10:00", "10:20", "10:40",
    "11:00", "11:20", "11:40",

    "13:00", "13:20", "13:40",
    "14:00", "14:20", "14:40",
    "15:00", "15:20", "15:40",
    "16:00", "16:20", "16:40",
    "17:00", "17:20", "17:40"
  ];

  // =====================================
  // CARREGAR DADOS
  // =====================================

  useEffect(() => {

    async function carregarDados() {

      try {

        // ================================
        // PETS
        // ================================

        const resPets = await fetch(
          "http://localhost:5000/api/pets"
        );

        if (resPets.ok) {

          const dataPets =
            await resPets.json();

          const meusPets =
            dataPets.filter(
              (pet) =>
                String(pet.clienteId) ===
                  String(clienteId) ||
                String(pet.dono) ===
                  String(clienteId)
            );

          setPets(meusPets);
        }

        // ================================
        // SERVIÇOS
        // ================================

        const resServicos = await fetch(
          "http://localhost:5000/api/servicos"
        );

        if (resServicos.ok) {

          const dataServicos =
            await resServicos.json();

          setServicos(dataServicos);
        }

        // ================================
        // AGENDAMENTOS
        // ================================

        const resAgendamentos =
          await fetch(
            "http://localhost:5000/api/agendamentos"
          );

        if (resAgendamentos.ok) {

          const dataAgendamentos =
            await resAgendamentos.json();

          setAgendamentosExistentes(
            dataAgendamentos
          );
        }

      } catch (error) {

        console.error(
          "Erro ao carregar dados:",
          error
        );
      }
    }

    if (clienteId) {
      carregarDados();
    }

  }, [clienteId]);

  // =====================================
  // VERIFICAR HORÁRIO
  // =====================================

  function horarioIndisponivel(horario) {

    if (!dataSelecionada) {
      return false;
    }

    // Não permite horário que já passou hoje
    if (dataSelecionada === dataHoje) {

      const [h, m] =
        horario.split(":");

      const agora = new Date();

      const horaItem =
        new Date();

      horaItem.setHours(
        Number(h),
        Number(m),
        0,
        0
      );

      if (horaItem <= agora) {
        return true;
      }
    }

    // Verifica agendamento existente
    return agendamentosExistentes.some(
      (ag) =>
        ag.data === dataSelecionada &&
        ag.horario === horario
    );
  }

  // =====================================
  // CONFIRMAR AGENDAMENTO
  // =====================================

  async function confirmarAgendamento(e) {

    e.preventDefault();

    if (!clienteId) {
      alert(
        "Cliente não identificado. Faça login novamente."
      );
      return;
    }

    if (
      !petSelecionado ||
      !servicoSelecionado ||
      !dataSelecionada ||
      !horarioSelecionado
    ) {

      alert(
        "Preencha todos os campos!"
      );

      return;
    }

    if (
      horarioIndisponivel(
        horarioSelecionado
      )
    ) {

      alert(
        "Este horário não está mais disponível!"
      );

      return;
    }

    // Busca pet
    const petObj =
      pets.find(
        (p) =>
          String(p._id) ===
          String(petSelecionado)
      );

    // Busca serviço
    const servicoObj =
      servicos.find(
        (s) =>
          String(s._id) ===
          String(servicoSelecionado)
      );

    if (!petObj) {
      alert(
        "Pet selecionado não encontrado."
      );
      return;
    }

    if (!servicoObj) {
      alert(
        "Serviço selecionado não encontrado."
      );
      return;
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/agendamentos",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            clienteId:
              String(clienteId),

            pet:
              petObj.nome,

            servico:
              servicoObj.nome,

            data:
              dataSelecionada,

            horario:
              horarioSelecionado,

            status:
              "Pendente"
          })
        }
      );

      const dados =
        await res.json();

      if (!res.ok) {

        alert(
          dados.mensagem ||
          "Erro ao realizar agendamento."
        );

        return;
      }

      alert(
        "Agendamento realizado com sucesso!"
      );

      navigate(
        "/meus-agendamentos"
      );

    } catch (error) {

      console.error(
        "Erro ao agendar:",
        error
      );

      alert(
        "Erro ao conectar com o servidor."
      );
    }
  }

  // =====================================
  // TELA
  // =====================================

  return (
    <div>

      <div
        className="welcome-card"
        style={{ marginBottom: "30px" }}
      >

        <div className="welcome-text">

          <h1>
            Agendar Serviço
          </h1>

          <p>
            Escolha o seu pet e o serviço desejado
          </p>

        </div>

      </div>

      <form
        className="formulario"
        onSubmit={confirmarAgendamento}
      >

        <h2>
          Selecione os Dados
        </h2>

        {/* PET */}

        <p className="info-label">
          Selecione o Pet:
        </p>

        <select
          value={petSelecionado}
          onChange={(e) =>
            setPetSelecionado(
              e.target.value
            )
          }
          required
        >

          <option value="">
            Escolha um pet
          </option>

          {pets.map((pet) => (

            <option
              key={pet._id}
              value={pet._id}
            >
              {pet.nome}
            </option>

          ))}

        </select>

        {/* SERVIÇO */}

        <p className="info-label">
          Selecione o Serviço:
        </p>

        <select
          value={servicoSelecionado}
          onChange={(e) =>
            setServicoSelecionado(
              e.target.value
            )
          }
          required
        >

          <option value="">
            Escolha um serviço
          </option>

          {servicos.map((servico) => (

            <option
              key={servico._id}
              value={servico._id}
            >
              {servico.nome}
              {" - R$ "}
              {servico.preco}
            </option>

          ))}

        </select>

        {/* DATA */}

        <p className="info-label">
          Data do Agendamento:
        </p>

        <input
          type="date"
          min={dataHoje}
          value={dataSelecionada}
          onChange={(e) => {

            setDataSelecionada(
              e.target.value
            );

            setHorarioSelecionado("");

          }}
          required
        />

        {/* HORÁRIO */}

        <p className="info-label">
          Horário Disponível:
        </p>

        <select
          value={horarioSelecionado}
          onChange={(e) =>
            setHorarioSelecionado(
              e.target.value
            )
          }
          disabled={!dataSelecionada}
          required
        >

          <option value="">
            {!dataSelecionada
              ? "Escolha a data primeiro"
              : "Escolha um horário"}
          </option>

          {horariosFuncionamento.map(
            (hora) => {

              const ocupado =
                horarioIndisponivel(
                  hora
                );

              return (
                <option
                  key={hora}
                  value={hora}
                  disabled={ocupado}
                >
                  {hora}
                  {ocupado
                    ? " - Indisponível"
                    : " - Disponível"}
                </option>
              );
            }
          )}

        </select>

        <button type="submit">
          Confirmar Agendamento
        </button>

      </form>

    </div>
  );
}

export default AgendarServico;
