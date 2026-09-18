import { useState, useEffect } from "react";

function MeusPets() {
  const [pets, setPets] = useState([]);

  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("Cachorro");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");

  const [exibirForm, setExibirForm] = useState(false);

  const clienteId = localStorage.getItem("clienteId") || "";

  // =====================================
  // CARREGAR PETS
  // =====================================

  useEffect(() => {
    if (clienteId) {
      carregarPets();
    }
  }, [clienteId]);

  async function carregarPets() {
    try {
      const res = await fetch(
        "http://localhost:5000/api/pets"
      );

      if (!res.ok) {
        throw new Error("Erro ao buscar pets");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        setPets([]);
        return;
      }

      // Mostra somente os pets do cliente logado
      const meusPets = data.filter(
        (pet) =>
          String(pet.clienteId) === String(clienteId) ||
          String(pet.dono) === String(clienteId)
      );

      setPets(meusPets);

    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      setPets([]);
    }
  }

  // =====================================
  // CADASTRAR PET
  // =====================================

  async function cadastrarPet(e) {
    e.preventDefault();

    if (!clienteId) {
      alert("Cliente não identificado. Faça login novamente.");
      return;
    }

    if (!nome.trim() || !especie.trim() || !raca.trim()) {
      alert("Preencha nome, espécie e raça.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/pets",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            nome: nome.trim(),
            especie,
            raca: raca.trim(),
            idade: idade ? Number(idade) : 0,

            // IMPORTANTE
            clienteId: String(clienteId),
            dono: String(clienteId)
          })
        }
      );

      const dados = await res.json();

      if (!res.ok) {
        alert(
          dados.mensagem ||
          "Erro ao cadastrar pet."
        );
        return;
      }

      alert("Pet cadastrado com sucesso!");

      // Coloca o novo pet na tela imediatamente
      setPets((listaAtual) => [
        ...listaAtual,
        dados
      ]);

      // Limpa formulário
      setNome("");
      setEspecie("Cachorro");
      setRaca("");
      setIdade("");
      setExibirForm(false);

    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);

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
          <h1>Meus Pets</h1>

          <p>
            Gerencie o cadastro dos seus companheiros
          </p>
        </div>

        <span className="welcome-paw"></span>
      </div>

      <button
        onClick={() =>
          setExibirForm(!exibirForm)
        }
      >
        {exibirForm
          ? "Cancelar"
          : "+ Novo Pet"}
      </button>

      {exibirForm && (
        <form
          className="formulario"
          onSubmit={cadastrarPet}
        >

          <h2>Novo Pet</h2>

          <input
            type="text"
            placeholder="Nome do Pet"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            required
          />

          <select
            value={especie}
            onChange={(e) =>
              setEspecie(e.target.value)
            }
            required
          >
            <option value="Cachorro">
              Cachorro
            </option>

            <option value="Gato">
              Gato
            </option>

            <option value="Outro">
              Outro
            </option>
          </select>

          <input
            type="text"
            placeholder="Raça"
            value={raca}
            onChange={(e) =>
              setRaca(e.target.value)
            }
            required
          />

          <input
            type="number"
            placeholder="Idade (anos)"
            value={idade}
            onChange={(e) =>
              setIdade(e.target.value)
            }
            min="0"
          />

          <button type="submit">
            Salvar Pet
          </button>

        </form>
      )}

      <div className="pets-container">

        {pets.length === 0 ? (
          <p>
            Nenhum pet cadastrado até o momento.
          </p>
        ) : (

          pets.map((p) => (

            <div
              key={p._id}
              className="pet-card"
            >

              <h2>
                {p.nome}
              </h2>

              <p>
                <span className="info-label">
                  Espécie:
                </span>{" "}
                {p.especie}
              </p>

              <p>
                <span className="info-label">
                  Raça:
                </span>{" "}
                {p.raca}
              </p>

              <p>
                <span className="info-label">
                  Idade:
                </span>{" "}
                {p.idade
                  ? `${p.idade} anos`
                  : "Não informada"}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default MeusPets;
