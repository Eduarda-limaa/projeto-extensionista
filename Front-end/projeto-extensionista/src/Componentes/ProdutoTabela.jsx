import { FiEdit, FiTrash2 } from "react-icons/fi";
import estilo from "../Pages/Cadastro.module.css";

export default function ProdutoTabela({ produtos = [], onEdit, onDelete }) {
  return (
    <div className={estilo.tabelaWrapper}>
      <table className={estilo.produtoTabela}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th>Estoque Minimo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.length === 0 ? (
            <tr>
              <td colSpan="8">Nenhum produto encontrado</td>
            </tr>
          ) : (
            produtos.map((p) => {
              const estoque = p?.alerta_estoque;
              const validade = p?.alerta_validade;

              let status = "OK";
              let statusClass = estilo.statusOk;
              let rowClass = "";

              if (estoque && estoque.nivel === "critico") {
                status = "Estoque baixo";
                statusClass = estilo.statusCritico;
                rowClass = estilo.linhaCritica;
              }

              if (validade && validade.nivel === "vencido") {
                status = "Vencido";
                statusClass = estilo.statusVencido;
                rowClass = estilo.linhaCritica;
              }

              if (validade && validade.nivel === "alerta") {
                status = validade.mensagem || "Alerta de validade";
                statusClass = estilo.statusAlerta;
                rowClass = estilo.linhaAlerta;
              }
              
              return (
                <tr key={p.id} className={rowClass}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.tipo}</td>
                  <td>{p.quantidade}</td>
                  <td>R$ {p.preco_de_custo}</td>
                  <td>{p.estoque_minimo}</td>

                  <td className={statusClass}>{status}</td>

                  <td>
                    <div className={estilo.acao}>
                      <button
                        className={estilo.editBtn}
                        onClick={() => onEdit(p)}
                      >
                        <FiEdit size={18} />
                      </button>

                      <button
                        className={estilo.deleteBtn}
                        onClick={() => onDelete(p.id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}