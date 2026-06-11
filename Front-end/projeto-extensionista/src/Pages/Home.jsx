import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiUser, FiBox, FiList, FiLogOut } from "react-icons/fi";
import estilo from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username");
    setNome(user);
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className={estilo.homeContainer}>
      <header className={estilo.homeHeader}>
        <div className={estilo.userInfo}>
          <FiUser className={estilo.userIcon} />
          <span className={estilo.userNome}>
            Olá, {nome ? nome : "usuário"}!
          </span>
        </div>

        <button className={estilo.logoutBtn} onClick={logout}>
          <FiLogOut /> Sair
        </button>
      </header>

      <main className={estilo.homeContent}>
        <h1 className={estilo.homeTitle}>Menu principal</h1>

        <div className={estilo.homeCards}>
          <button 
            className={estilo.homeCard}
            onClick={() => navigate("/cadastro-produto")}
          >
            <FiBox className={estilo.cardIcon} />
            <span>Cadastro de Produto</span>
          </button>

          <button 
            className={estilo.homeCard}
            onClick={() => navigate("/gestao-estoque")}
          >
            <FiList className={estilo.cardIcon} />
            <span>Gestão de Estoque</span>
          </button>
        </div>
      </main>
    </div>
  );
}
