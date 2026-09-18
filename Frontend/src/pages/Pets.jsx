import { useEffect, useState } from "react";

function Pets() {
  const [pets, setPets] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editando, setEditando] =
    useState(null);

  const [novoPet, setNovoPet] = useState({
    nome: "",
    especie: "",
    raca: "",
    dono: ""
  });


  // =====================================
  // BUSCAR PETS
  // =====================================

  useEffect(() => {
    buscarPets();
  }, []);


  async function buscarPets() {
    try {
      const resposta = await fetch(
        "http://localhost:5000/api/pets"
      );

      if (!resposta.ok) {
        throw new Error(
          "Erro ao buscar pets"
        );
      }

      const dados =
        await resposta.json();

      setPets(dados);

    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível carregar os pets."
      );
    }
  }


  // =====================================
  // CADASTRAR PET
  // =====================================

  async function cadastrarPet(e) {
    e.preventDefault();

    if (
      !novoPet.nome.trim() ||
      !novoPet.especie.trim() ||
      !novoPet.raca.trim() ||
      !novoPet.dono.trim()
    ) {
      alert(
        "Preencha todos os campos."
      );

      return;
    }

    try {
      const resposta =
        await fetch(
          "http://localhost:5000/api/pets",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(novoPet)
          }
        );

      const dados =
        await resposta.json();

      if (!resposta.ok) {
        alert(
          dados.mensagem ||
            "Erro ao cadastrar pet."
        );

        return;
      }

      setPets(
        (listaAtual) => [
          ...listaAtual,
          dados
        ]
      );

      limparFormulario();

    } catch (error) {
      console.error(error);

      alert(
        "Erro ao conectar com o servidor."
      );
    }
  }


  // =====================================
  // EDITAR PET
  // =====================================

  function editarPet(pet) {
    setEditando(pet._id);

    setNovoPet({
      nome: pet.nome || "",
      especie: pet.especie || "",
      raca: pet.raca || "",
      dono: pet.dono || ""
    });

    setMostrarFormulario(true);
  }


  // =====================================
  // SALVAR EDIÇÃO
  // =====================================

  async function salvarEdicao(e) {
    e.preventDefault();

    if (
      !novoPet.nome.trim() ||
      !novoPet.especie.trim() ||
      !novoPet.raca.trim() ||
      !novoPet.dono.trim()
    ) {
      alert(
        "Preencha todos os campos."
      );

      return;
    }

    try {
      const resposta =
        await fetch(
          `http://localhost:5000/api/pets/${editando}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(novoPet)
          }
        );

      const dados =
        await resposta.json();

      if (!resposta.ok) {
        alert(
          dados.mensagem ||
            "Erro ao editar pet."
        );

        return;
      }

      setPets(
        (listaAtual) =>
          listaAtual.map(
            (pet) =>
              pet._id === editando
                ? dados
                : pet
          )
      );

      limparFormulario();

    } catch (error) {
      console.error(error);

      alert(
        "Erro ao conectar com o servidor."
      );
    }
  }


  // =====================================
  // REMOVER PET
  // =====================================

  async function removerPet(id) {
    const confirmar =
      window.confirm(
        "Deseja remover este pet?"
      );

    if (!confirmar) {
      return;
    }

    try {
      const resposta =
        await fetch(
          `http://localhost:5000/api/pets/${id}`,
          {
            method: "DELETE"
          }
        );

      const dados =
        await resposta.json();

      if (!resposta.ok) {
        alert(
          dados.mensagem ||
            "Erro ao remover pet."
        );

        return;
      }

      setPets(
        (listaAtual) =>
          listaAtual.filter(
            (pet) =>
              pet._id !== id
          )
      );

    } catch (error) {
      console.error(error);

      alert(
        "Erro ao conectar com o servidor."
      );
    }
  }


  // =====================================
  // LIMPAR FORMULÁRIO
  // =====================================

  function limparFormulario() {
    setNovoPet({
      nome: "",
      especie: "",
      raca: "",
      dono: ""
    });

    setEditando(null);

    setMostrarFormulario(false);
  }


  // =====================================
  // NOVO PET
  // =====================================

  function novoCadastro() {
    setEditando(null);

    setNovoPet({
      nome: "",
      especie: "",
      raca: "",
      dono: ""
    });

    setMostrarFormulario(true);
  }


  // =====================================
  // TELA
  // =====================================

  return (
    <div>

      <h1>Pets cadastrados</h1>

      <button
        onClick={novoCadastro}
      >
        + Novo Pet
      </button>


      {mostrarFormulario && (

        <form
          className="formulario"
          onSubmit={
            editando !== null
              ? salvarEdicao
              : cadastrarPet
          }
        >

          <input
            type="text"
            placeholder="Nome do pet"
            value={novoPet.nome}
            onChange={(e) =>
              setNovoPet({
                ...novoPet,
                nome: e.target.value
              })
            }
          />


          <input
            type="text"
            placeholder="Espécie"
            value={novoPet.especie}
            onChange={(e) =>
              setNovoPet({
                ...novoPet,
                especie:
                  e.target.value
              })
            }
          />


          <input
            type="text"
            placeholder="Raça"
            value={novoPet.raca}
            onChange={(e) =>
              setNovoPet({
                ...novoPet,
                raca:
                  e.target.value
              })
            }
          />


          <input
            type="text"
            placeholder="ID do dono"
            value={novoPet.dono}
            onChange={(e) =>
              setNovoPet({
                ...novoPet,
                dono:
                  e.target.value
              })
            }
          />


          <button type="submit">
            {editando !== null
              ? "Salvar Alterações"
              : "Salvar Pet"}
          </button>


          <button
            type="button"
            onClick={
              limparFormulario
            }
          >
            Cancelar
          </button>

        </form>
      )}


      <div className="pets-container">

        {pets.map((pet) => (

          <div
            className="pet-card"
            key={pet._id}
          >

            <h2>
              {pet.nome}
            </h2>


            <p>
              <span className="info-label">
                Espécie:
              </span>{" "}
              {pet.especie}
            </p>


            <p>
              <span className="info-label">
                Raça:
              </span>{" "}
              {pet.raca}
            </p>


            <p>
              <span className="info-label">
                Dono:
              </span>{" "}
              {pet.nomeDono ||
                "Cliente não encontrado"}
            </p>


            <button
              onClick={() =>
                editarPet(pet)
              }
            >
              Editar
            </button>


            <button
              onClick={() =>
                removerPet(pet._id)
              }
            >
              Remover
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Pets;
