import estilo from './Busca.module.css';

export default function CampoBusca({ value, onChange, onSearch }) {
  return (
    <div className={estilo.buscaContainer}>
      <input
        type="text"
        value={value}
        placeholder="Buscar produto..."
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onSearch}>Buscar</button>
    </div>
  );
}
