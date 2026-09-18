import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MeusAgendamentos() {
  const navigate = useNavigate();
  const clienteId = localStorage.getItem("clienteId");

  const [agendamentos, setAgendamentos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  const horarios = [
    "08:00","08:20","08:40","09:00","09:20","09:40",
    "10:00","10:20","10:40","11:00","11:20","11:40",
    "13:00","13:20","13:40","14:00","14:20","14:40",
    "15:00","15:20","15:40","16:00","16:20","16:40",
    "17:00","17:20","17:40"
  ];

  useEffect(() => {
    if (!clienteId) return navigate("/login");
    carregar();
  }, [clienteId]);

  async function carregar() {
    try {
      const res = await fetch("http://localhost:5000/api/agendamentos");
      const dados = await res.json();

      setAgendamentos(
        dados.filter(a => String(a.clienteId) === String(clienteId))
      );
    } catch (err) {
      console.error(err);
    }
  }

  function editar(a) {
    setEditando(a);
    setData(a.data);
    setHorario(a.horario);
  }

  async function salvar(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/agendamentos/${editando._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clienteId,
            pet: editando.pet,
            servico: editando.servico,
            data,
            horario,
            status: editando.status || "Pendente"
          })
        }
      );

      if (!res.ok) {
        const erro = await res.json();
        alert(erro.mensagem || "Erro ao editar.");
        return;
      }

      alert("Agendamento atualizado!");
      setEditando(null);
      carregar();

    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este agendamento?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/agendamentos/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        alert("Erro ao excluir agendamento.");
        return;
      }

      setAgendamentos(
        agendamentos.filter(a => a._id !== id)
      );

    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  }

  return (
    <div>
      <h1>Meus Agendamentos</h1>

      {editando && (
        <form className="formulario" onSubmit={salvar}>
          <h2>Editar Agendamento</h2>

          <p><b>Pet:</b> {editando.pet}</p>
          <p><b>Serviço:</b> {editando.servico}</p>

          <label className="info-label">Data:</label>
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />

          <label className="info-label">Horário:</label>
          <select
            value={horario}
            onChange={e => setHorario(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {horarios.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <button type="submit">Salvar</button>

          <button
            type="button"
            onClick={() => setEditando(null)}
          >
            Cancelar
          </button>
        </form>
      )}

      <div className="pets-container">
        {agendamentos.length === 0 ? (
          <p>Você ainda não possui nenhum agendamento.</p>
        ) : (
          agendamentos.map(a => (
            <div className="pet-card" key={a._id}>
              <h2>{a.servico}</h2>

              <p>
                <span className="info-label">Pet:</span> {a.pet}
              </p>

              <p>
                <span className="info-label">Data:</span> {a.data}
              </p>

              <p>
                <span className="info-label">Horário:</span> {a.horario}
              </p>

              <p>
                <span className="info-label">Status:</span>{" "}
                {a.status || "Pendente"}
              </p>

              <button onClick={() => editar(a)}>
                Editar
              </button>

              <button onClick={() => excluir(a._id)}>
                Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MeusAgendamentos;
