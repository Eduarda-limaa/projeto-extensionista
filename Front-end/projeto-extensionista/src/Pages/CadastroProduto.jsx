import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CampoBusca from "../Componentes/CampoBusca";
import ProdutoForm from "../Componentes/ProdutoForm";
import ProdutoTabela from "../Componentes/ProdutoTabela";

import estilo from "./Cadastro.module.css";

export default function CadastroProduto() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  const [modalProduto, setModalProduto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    quantidade: "",
    preco_de_custo: "",
    preco_de_venda: "",
    estoque_minimo: "",
    validade: "",
  });

  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  async function carregarProdutos() {
    const resp = await axios.get("http://127.0.0.1:8000/produto/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProdutos(resp.data);
  }

  useEffect(() => { carregarProdutos(); }, []);

  async function salvarProduto(e) {
    e.preventDefault();

    const url = editId
      ? `http://127.0.0.1:8000/produto/${editId}/`
      : "http://127.0.0.1:8000/produto/";

    const metodo = editId ? "put" : "post";

    await axios[metodo](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    carregarProdutos();
    setModalProduto(false);
  }

  function abrirModalProduto(produto = null) {
    if (produto) {
      setForm(produto);
      setEditId(produto.id);
    } else {
      setForm({
        nome: "",
        tipo: "",
        quantidade: "",
        preco_de_custo: "",
        preco_de_venda: "",
        estoque_minimo: "",
        validade: "", 
      });
      setEditId(null);
    }
    setModalProduto(true);
  }


  async function excluir(id) {
    if (!confirm("Excluir produto?")) return;

    await axios.delete(`http://127.0.0.1:8000/produto/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    carregarProdutos();
  }

  async function buscar() {
    const resp = await axios.get(`http://127.0.0.1:8000/produto/?search=${busca}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProdutos(resp.data);
  }

  return (
  <div className={estilo.cadastroContainer}>
    <h1 className={estilo.cadastroTitulo}>Cadastro de Produtos</h1>

    <CampoBusca value={busca} onChange={setBusca} onSearch={buscar} />

    <div className={estilo.tabelaWrapper}>
      <div className={estilo.tabelaTopo}>
        <h2>Produtos</h2>
        <button
          className={estilo.addBtn}
          onClick={() => {
            setForm({});        // limpa formulário
            setEditId(null);    // modo de edição desativado
            setModalProduto(true); // abre modal
          }}
        >
          +
        </button>
      </div>

      <ProdutoTabela
        produtos={produtos}
        onEdit={abrirModalProduto}
        onDelete={excluir}
      />
    </div>

    <button onClick={() => navigate("/Inicial")} className={estilo.voltarBtn}>
      Voltar
    </button>

    <ProdutoForm
      open={modalProduto}
      onClose={() => setModalProduto(false)}
      form={form}
      setForm={setForm}
      onSubmit={salvarProduto}
      editId={editId}
    />
  </div>
);
}
