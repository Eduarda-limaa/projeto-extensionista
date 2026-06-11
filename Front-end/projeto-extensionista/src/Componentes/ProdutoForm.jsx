import { useState, useEffect } from "react";
import axios from "axios";
import ComboTipoProduto from "./ComboProduto";
import estilo from "./Produto.module.css";

export default function ProdutoForm({ open, onClose, form, setForm, editId }) {
  const [loading, setLoading] = useState(false);

  // ✅ Evita erro de render
  useEffect(() => {
    if (!form.especificacao) {
      setForm((prev) => ({ ...prev, especificacao: {} }));
    }
  }, []);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      let produtoId;

      if (editId) {
        await axios.put(
          `http://127.0.0.1:8000/produto/${editId}/`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        produtoId = editId;
      } else {
        const res = await axios.post(
          "http://127.0.0.1:8000/produto/",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        produtoId = res.data.id;
      }

      onClose(false); // fecha modal
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={estilo.modalOverlay}>
      <div className={estilo.modalContainer}>
        <button
          className={estilo.modalClose}
          onClick={() => onClose(false)}
        >
          ×
        </button>

        <h2 className={estilo.modalTitle}>
          {editId ? "Editar Produto" : "Cadastrar Produto"}
        </h2>

        <form className={estilo.formProduto} onSubmit={handleSubmit}>
          
          <ComboTipoProduto
            value={form.tipo}
            onChange={(tipo) => setForm({ ...form, tipo })}
          />

          <label>Nome *</label>
          <input
            type="text"
            value={form.nome || ""}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <label>Data Cadastro</label>
          <input
            type="date"
            value={form.data_cadastro || ""}
            onChange={(e) =>
              setForm({ ...form, data_cadastro: e.target.value })
            }
          />
          
          <label>Preço de Custo *</label>
          <input
            type="number"
            value={form.preco_de_custo || ""}
            onChange={(e) =>
              setForm({ ...form, preco_de_custo: e.target.value })
            }
          />

          <label>Preço de Venda *</label>
          <input
            type="number"
            value={form.preco_de_venda || ""}
            onChange={(e) =>
              setForm({ ...form, preco_de_venda: e.target.value })
            }
          />

          <label>Validade</label>
          <input
            type="date"
            value={form.validade || ""}
            onChange={(e) =>
              setForm({ ...form, validade: e.target.value })
            }
          />

          <label>Quantidade *</label>
          <input
            type="number"
            value={form.quantidade || ""}
            onChange={(e) =>
              setForm({ ...form, quantidade: e.target.value })
            }
          />

          <label>Estoque mínimo *</label>
          <input
            type="number"
            value={form.estoque_minimo || ""}
            onChange={(e) =>
              setForm({ ...form, estoque_minimo: e.target.value })
            }
          />

          <button
            type="submit"
            className={estilo.modalSubmit}
            disabled={loading}
          >
            {loading
              ? "Salvando..."
              : editId
              ? "Salvar Alterações"
              : "Cadastrar Produto"}
          </button>
        </form>
      </div>
    </div>
  );
}