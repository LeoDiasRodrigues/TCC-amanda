import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modoCadastro) {
      try {
        const response = await fetch("http://localhost:5000/api/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, telefone, senha })
        });

        const data = await response.json();

        if (response.ok) {
          alert("Conta criada com sucesso! Você já está logado.");
          const idSalvo = data._id || data.cliente?._id || data.id;
          localStorage.setItem("clienteId", idSalvo);
          navigate("/meus-pets", { replace: true });
        } else {
          alert(data.mensagem || "Erro ao criar conta.");
        }
      } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Erro ao conectar com o servidor.");
      }
    } else {
      if (email === "admin" && senha === "1234") {
        sessionStorage.setItem("adminLogado", "true");
        navigate("/", { replace: true });
      } else {
        try {
          const response = await fetch("http://localhost:5000/api/clientes");
          const clientes = await response.json();
          const clienteEncontrado = clientes.find((c) => c.email === email);

          if (clienteEncontrado) {
            localStorage.setItem("clienteId", clienteEncontrado._id);
            navigate("/meus-pets", { replace: true });
          } else {
            alert("Usuário não encontrado. Crie uma conta!");
          }
        } catch (error) {
          console.error("Erro no login:", error);
          alert("Erro ao efetuar login.");
        }
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">Mundo Pet</div>
        <h1>{modoCadastro ? "Criar Conta" : "Bem-vindo!"}</h1>
        <p className="login-subtitle">
          {modoCadastro ? "Preencha os dados para se cadastrar" : "Acesse o sistema de gerenciamento"}
        </p>

        <form onSubmit={handleSubmit}>
          {modoCadastro && (
            <>
              <p className="login-subtitle" style={{ textAlign: "left", marginBottom: "6px" }}>Nome</p>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <p className="login-subtitle" style={{ textAlign: "left", marginBottom: "6px" }}>Telefone</p>
              <input
                type="text"
                placeholder="Digite seu telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </>
          )}

          <p className="login-subtitle" style={{ textAlign: "left", marginBottom: "6px" }}>
            {modoCadastro ? "E-mail" : "Usuário / E-mail"}
          </p>
          <input
            type="text"
            placeholder={modoCadastro ? "Digite seu e-mail" : "Digite seu usuário ou e-mail"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="login-subtitle" style={{ textAlign: "left", marginBottom: "6px" }}>Senha</p>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" style={{ marginTop: "10px" }}>
            {modoCadastro ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <div className="login-toggle-container">
          <button
            type="button"
            className="btn-toggle-modo"
            onClick={() => setModoCadastro(!modoCadastro)}
          >
            {modoCadastro ? "Já tem uma conta? Faça login" : "Não tem uma conta? Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;