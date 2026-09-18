import { useState, useEffect } from "react";

function Servicos() {
  // Inicializa o estado de serviços vazio
  const [servicos, setServicos] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);

  const [novoServico, setNovoServico] = useState({
    nome: "",
    descricao: "",
    preco: ""
  });

  // Verifica se o admin está logado
  const eAdmin = sessionStorage.getItem("adminLogado") === "true";

  // Carrega os serviços do backend ao iniciar o componente
  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const res = await fetch("http://localhost:5000/api/servicos");
      if (res.ok) {
        const data = await res.json();
        setServicos(data);
      }
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
    }
  }

  async function cadastrarServico(e) {
    e.preventDefault();

    if (!eAdmin) {
      alert("Apenas o administrador pode cadastrar serviços.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoServico)
      });

      if (res.ok) {
        alert("Serviço cadastrado com sucesso!");
        limparFormulario();
        carregarServicos();
      } else {
        // Fallback local caso haja algum detalhe na rota
        setServicos([...servicos, novoServico]);
        limparFormulario();
      }
    } catch (err) {
      // Fallback local caso o servidor backend não responda
      setServicos([...servicos, novoServico]);
      limparFormulario();
    }
  }

  function editarServico(index) {
    setEditando(index);
    setNovoServico({
      ...servicos[index]
    });
    setMostrarFormulario(true);
  }

  function salvarEdicao(e) {
    e.preventDefault();

    const listaAtualizada = servicos.map((servico, index) => {
      if (index === editando) {
        return novoServico;
      }
      return servico;
    });

    setServicos(listaAtualizada);
    limparFormulario();
  }

  function removerServico(index) {
    const confirmar = window.confirm("Deseja remover este serviço?");

    if (confirmar) {
      const novaLista = servicos.filter((_, i) => i !== index);
      setServicos(novaLista);
    }
  }

  function limparFormulario() {
    setNovoServico({
      nome: "",
      descricao: "",
      preco: ""
    });
    setEditando(null);
    setMostrarFormulario(false);
  }

  return (
    <div>
      <h1>Serviços</h1>

      {/* O botão de criar serviço só aparece para o Admin */}
      {eAdmin && (
        <button onClick={() => setMostrarFormulario(true)}>
          + Novo Serviço
        </button>
      )}

      {/* Formulário visível apenas para o Admin quando acionado */}
      {eAdmin && mostrarFormulario && (
        <form
          className="formulario"
          onSubmit={editando !== null ? salvarEdicao : cadastrarServico}
        >
          <h2>{editando !== null ? "Editar Serviço" : "Novo Serviço"}</h2>

          <input
            type="text"
            placeholder="Nome do serviço"
            value={novoServico.nome}
            onChange={(e) =>
              setNovoServico({
                ...novoServico,
                nome: e.target.value
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Descrição"
            value={novoServico.descricao}
            onChange={(e) =>
              setNovoServico({
                ...novoServico,
                descricao: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Preço (ex: 50.00)"
            value={novoServico.preco}
            onChange={(e) =>
              setNovoServico({
                ...novoServico,
                preco: e.target.value
              })
            }
            required
          />

          <button type="submit">
            {editando !== null ? "Salvar Alterações" : "Salvar Serviço"}
          </button>

          <button type="button" onClick={limparFormulario}>
            Cancelar
          </button>
        </form>
      )}

      <div className="pets-container">
        {servicos.length === 0 ? (
          <p>Nenhum serviço cadastrado até o momento.</p>
        ) : (
          servicos.map((servico, index) => (
            <div className="pet-card" key={index}>
              <h2>{servico.nome}</h2>

              <p>
                <span className="info-label">Descrição:</span>{" "}
                {servico.descricao || "Sem descrição"}
              </p>

              <p>
                <span className="info-label">Valor:</span> R$ {servico.preco}
              </p>

              {/* Botões de controle visíveis apenas para o Admin */}
              {eAdmin && (
                <>
                  <button onClick={() => editarServico(index)}>
                    Editar
                  </button>
                  <button onClick={() => removerServico(index)}>
                    Remover
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Servicos;