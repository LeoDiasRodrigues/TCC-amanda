import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaDog,
  FaCalendarAlt,
  FaCut,
  FaPlusCircle,
  FaList
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  // Verifica qual tipo de usuário está logado
  const eAdmin = sessionStorage.getItem("adminLogado") === "true";
  const eCliente = localStorage.getItem("clienteId") !== null;

  function sair() {
    // Remove credenciais de ambos
    sessionStorage.removeItem("adminLogado");
    localStorage.removeItem("clienteId");

    // Redireciona para o login
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Mundo Pet</h2>
      </div>

      {/* LINKS DO ADMINISTRADOR */}
      {eAdmin && (
        <>
          <Link to="/">
            <FaHome /> Dashboard
          </Link>
          <Link to="/clientes">
            <FaUsers /> Clientes
          </Link>
          <Link to="/pets">
            <FaDog /> Todos os Pets
          </Link>
          <Link to="/servicos">
            <FaCut /> Serviços
          </Link>
          <Link to="/agendamentos">
            <FaCalendarAlt /> Agendamentos
          </Link>
        </>
      )}

      {/* LINKS DO CLIENTE */}
      {eCliente && !eAdmin && (
        <>
          <Link to="/meus-pets">
            <FaDog /> Meus Pets
          </Link>
          <Link to="/agendar">
            <FaPlusCircle /> Agendar Serviço
          </Link>
          <Link to="/meus-agendamentos">
            <FaList /> Meus Agendamentos
          </Link>
        </>
      )}

      <button className="logout" onClick={sair}>
        Sair
      </button>
    </aside>
  );
}

export default Sidebar;