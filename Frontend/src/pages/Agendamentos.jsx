import { useEffect, useState } from "react";

function AgendarAdmin() {
  const [clientes, setClientes] = useState([]);
  const [pets, setPets] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  const [cliente, setCliente] = useState("");
  const [pet, setPet] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [status, setStatus] = useState("Pendente");

  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(false);

  const horarios = [
    "08:00","08:20","08:40","09:00","09:20","09:40",
    "10:00","10:20","10:40","11:00","11:20","11:40",
    "13:00","13:20","13:40","14:00","14:20","14:40",
    "15:00","15:20","15:40","16:00","16:20","16:40",
    "17:00","17:20","17:40"
  ];

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const [c, s, a] = await Promise.all([
        fetch("http://localhost:5000/api/clientes"),
        fetch("http://localhost:5000/api/servicos"),
        fetch("http://localhost:5000/api/agendamentos")
      ]);

      setClientes(await c.json());
      setServicos(await s.json());
      setAgendamentos(await a.json());
    } catch (err) {
      console.error(err);
    }
  }

  async function selecionarCliente(e) {
    const id = e.target.value;

    setCliente(id);
    setPet("");

    if (!id) {
      setPets([]);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/pets"
      );

      const todos = await res.json();

      setPets(
        todos.filter((p) =>
          String(p.dono) === String(id) ||
          String(p.clienteId) === String(id) ||
          String(p.cliente) === String(id)
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function salvar(e) {
    e.preventDefault();

    if (!cliente || !pet || !servico || !data || !horario) {
      alert("Preencha todos os campos.");
      return;
    }

    const petObj = pets.find(
      (p) => String(p._id) === String(pet)
    );

    const servicoObj = servicos.find(
      (s) =>
        String(s._id || s.id) ===
        String(servico)
    );

    if (!petObj || !servicoObj) {
      alert("Pet ou serviço não encontrado.");
      return;
    }

    const dados = {
      clienteId: cliente,
      pet: petObj.nome,
      servico:
        servicoObj.nome ||
        servicoObj.titulo ||
        servicoObj.servico,
      data,
      horario,
      status
    };

    try {
      const url = editando
        ? `http://localhost:5000/api/agendamentos/${editando}`
        : "http://localhost:5000/api/agendamentos";

      const res = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      const resposta = await res.json();

      if (!res.ok) {
        alert(
          resposta.mensagem ||
          "Erro ao salvar agendamento."
        );
        return;
      }

      alert(
        editando
          ? "Agendamento atualizado!"
          : "Agendamento criado!"
      );

      limpar();
      carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  }

  async function editar(a) {
    setEditando(a._id);
    setCliente(a.clienteId);
    setData(a.data);
    setHorario(a.horario);
    setStatus(a.status || "Pendente");

    await selecionarCliente({
      target: { value: a.clienteId }
    });

    const petObj = pets.find(
      (p) => p.nome === a.pet
    );

    if (petObj) {
      setPet(petObj._id);
    }

    const servicoObj = servicos.find(
      (s) =>
        (s.nome || s.titulo || s.servico) ===
        a.servico
    );

    if (servicoObj) {
      setServico(
        servicoObj._id || servicoObj.id
      );
    }

    setForm(true);
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este agendamento?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/agendamentos/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        alert("Erro ao excluir.");
        return;
      }

      setAgendamentos(
        agendamentos.filter(
          (a) => a._id !== id
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  function limpar() {
    setCliente("");
    setPet("");
    setServico("");
    setData("");
    setHorario("");
    setStatus("Pendente");
    setEditando(null);
    setForm(false);
    setPets([]);
  }

  function nomeCliente(id) {
    const c = clientes.find(
      (c) => String(c._id) === String(id)
    );

    return c?.nome || c?.email || "Cliente";
  }

  return (
    <div>
      <h1>Agendamentos</h1>

      <button onClick={() => setForm(!form)}>
        {form ? "Cancelar" : "+ Novo Agendamento"}
      </button>

      {form && (
        <form
          className="formulario"
          onSubmit={salvar}
        >
          <h2>
            {editando
              ? "Editar Agendamento"
              : "Novo Agendamento"}
          </h2>

          <label className="info-label">
            Cliente:
          </label>

          <select
            value={cliente}
            onChange={selecionarCliente}
            required
          >
            <option value="">
              Selecione o cliente
            </option>

            {clientes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nome || c.email}
              </option>
            ))}
          </select>

          <label className="info-label">
            Pet:
          </label>

          <select
            value={pet}
            onChange={(e) => setPet(e.target.value)}
            disabled={!cliente}
            required
          >
            <option value="">
              Selecione o pet
            </option>

            {pets.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nome}
              </option>
            ))}
          </select>

          <label className="info-label">
            Serviço:
          </label>

          <select
            value={servico}
            onChange={(e) =>
              setServico(e.target.value)
            }
            required
          >
            <option value="">
              Selecione o serviço
            </option>

            {servicos.map((s) => (
              <option
                key={s._id || s.id}
                value={s._id || s.id}
              >
                {s.nome || s.titulo || s.servico}
                {s.preco != null
                  ? ` - R$ ${Number(s.preco).toFixed(2)}`
                  : ""}
              </option>
            ))}
          </select>

          <label className="info-label">
            Data:
          </label>

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <label className="info-label">
            Horário:
          </label>

          <select
            value={horario}
            onChange={(e) =>
              setHorario(e.target.value)
            }
            required
          >
            <option value="">
              Selecione o horário
            </option>

            {horarios.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <label className="info-label">
            Status:
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="Pendente">
              Pendente
            </option>
            <option value="Confirmado">
              Confirmado
            </option>
            <option value="Finalizado">
              Finalizado
            </option>
          </select>

          <button type="submit">
            {editando
              ? "Salvar Alterações"
              : "Cadastrar Agendamento"}
          </button>
        </form>
      )}

      <div style={{ marginTop: "30px" }}>
        <h2>Agendamentos realizados</h2>

        {agendamentos.length === 0 ? (
          <p>Nenhum agendamento realizado.</p>
        ) : (
          <div className="pets-container">
            {agendamentos.map((a) => (
              <div
                className="pet-card"
                key={a._id}
              >
                <h2>{a.servico}</h2>

                <p>
                  <span className="info-label">
                    Cliente:
                  </span>{" "}
                  {nomeCliente(a.clienteId)}
                </p>

                <p>
                  <span className="info-label">
                    Pet:
                  </span>{" "}
                  {a.pet}
                </p>

                <p>
                  <span className="info-label">
                    Data:
                  </span>{" "}
                  {a.data}
                </p>

                <p>
                  <span className="info-label">
                    Horário:
                  </span>{" "}
                  {a.horario}
                </p>

                <p>
                  <span className="info-label">
                    Status:
                  </span>{" "}
                  {a.status || "Pendente"}
                </p>

                <button
                  onClick={() => editar(a)}
                >
                  Editar
                </button>

                <button
                  onClick={() => excluir(a._id)}
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgendarAdmin;
