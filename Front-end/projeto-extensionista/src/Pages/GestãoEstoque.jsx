import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import estilo from './Gestao.module.css';

export default function GestaoEstoque() {
  const navigate = useNavigate(); 

  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [quantidade, setQuantidade] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([]);

  function getToken() {
    return localStorage.getItem("token");
  }

  async function carregarProdutos() {
    try {
      const token = getToken();
      const resp = await axios.get("http://127.0.0.1:8000/produto/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordenados = resp.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setProdutos(ordenados);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setMensagem("Erro ao carregar produtos.");
    }
  }

  async function carregarHistorico(id) {
    if (!id) {
      setHistorico([]);
      return;
    }
    try {
      const token = getToken();
      const resp = await axios.get(
        `http://127.0.0.1:8000/movimentacao/?produto=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistorico(resp.data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      setMensagem("Erro ao carregar histórico.");
    }
  }

  async function registrarMovimentacao() {
    if (!produtoId || quantidade <= 0) {
      setMensagem("Preencha todos os campos!");
      return;
    }
    const produtoSelecionado = produtos.find((p) => p.id == produtoId);
    let novoEstoque =
      tipo === "entrada"
        ? produtoSelecionado.quantidade + Number(quantidade)
        : produtoSelecionado.quantidade - Number(quantidade);

    if (tipo === "saida" && novoEstoque < produtoSelecionado.estoque_minimo) {
      alert(
        `Atenção: Estoque do produto ${produtoSelecionado.nome} está abaixo do mínimo!\n` +
          `Estoque Atual após saída: ${novoEstoque}\n` +
          `Estoque Mínimo: ${produtoSelecionado.estoque_minimo}`
      );
    }

    try {
      const token = getToken();
      await axios.post(
        "http://127.0.0.1:8000/movimentacao/",
        {
          produto: produtoId,
          tipo: tipo === "entrada" ? "ENTRADA" : "SAIDA",
          quantidade: Number(quantidade),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem("Movimentação registrada!");
      carregarProdutos();
      carregarHistorico(produtoId);
    } catch (err) {
      console.error("Erro ao registrar movimentação:", err);
      setMensagem("Erro ao registrar movimentação.");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    carregarHistorico(produtoId);
  }, [produtoId]);

  return (
    <div className={estilo.containerMov}>
      {/* ===== Botão Voltar ===== */}
      <button
        className={estilo.voltarBtn}
        onClick={() => navigate("/Inicial")}
      >
        ← Voltar para Home
      </button>

      <h2 className={estilo.titulo}>Gestão de Estoque</h2>

      <label className={estilo.label}>Selecione o produto:</label>
      <select
        className={estilo.select}
        value={produtoId}
        onChange={(e) => setProdutoId(e.target.value)}
      >
        <option value="">-- Escolher --</option>
        {produtos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome} (Atual: {p.quantidade})
          </option>
        ))}
      </select>

      <label className={estilo.label}>Tipo de movimentação:</label>
      <select
        className={estilo.select}
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <label className={estilo.label}>Quantidade:</label>
      <input
        className={estilo.input}
        type="number"
        min="1"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />

      <button onClick={registrarMovimentacao} className={estilo.btnMov}>
        Registrar
      </button>

      {mensagem && <p className={estilo.msg}>{mensagem}</p>}

      <h3 className={estilo.subtitulo}>Histórico de Movimentações</h3>

      {historico.length === 0 ? (
        <p className={estilo.semMov}>Nenhuma movimentação encontrada! Selecione um produto.</p>
      ) : (
        <table className={estilo.tabelaHistorico}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((h) => (
              <tr key={h.id}>
                <td>{h.data_operacao}</td>
                <td>{h.tipo}</td>
                <td>{h.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
