import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Pets from "./pages/Pets";
import Agendamentos from "./pages/Agendamentos";
import Servicos from "./pages/Servicos";
import Login from "./pages/Login";
import MeusPets from "./pages/MeusPets";
import AgendarServico from "./pages/AgendarServico";
import MeusAgendamentos from "./pages/MeusAgendamentos";

function RotaProtegida({ children }) {
  const estaLogado = sessionStorage.getItem("adminLogado") === "true" || localStorage.getItem("clienteId") !== null;
  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Bloqueia rotas exclusivas do Admin
function RotaAdmin({ children }) {
  const eAdmin = sessionStorage.getItem("adminLogado") === "true";
  if (!eAdmin) {
    return <Navigate to="/meus-pets" replace />;
  }
  return children;
}

function LayoutProtegido() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Routes>
          {/* Rotas Exclusivas do Administrador */}
          <Route path="/" element={<RotaAdmin><Home /></RotaAdmin>} />
          <Route path="/clientes" element={<RotaAdmin><Clientes /></RotaAdmin>} />
          <Route path="/pets" element={<RotaAdmin><Pets /></RotaAdmin>} />
          <Route path="/agendamentos" element={<RotaAdmin><Agendamentos /></RotaAdmin>} />
          <Route path="/servicos" element={<RotaAdmin><Servicos /></RotaAdmin>} />

          {/* Rotas Exclusivas do Cliente */}
          <Route path="/meus-pets" element={<MeusPets />} />
          <Route path="/agendar" element={<AgendarServico />} />
          <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<RotaProtegida><LayoutProtegido /></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;