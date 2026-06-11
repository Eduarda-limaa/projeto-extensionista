import { useEffect, useState } from "react";
import axios from "axios";

export default function ComboTipoProduto({ value, onChange }) {
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    async function fetchTipos() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/tipos_produto/");
        setTipos(res.data);
      } catch (error) {
        console.error("Erro ao buscar tipos:", error);
      }
    }

    fetchTipos();
  }, []);

  return (
    <div className="combo-container">
      <label>Tipo do Produto</label>

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecione o tipo...</option>

        {tipos.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}