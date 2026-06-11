import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import CadastroProduto from "./Pages/CadastroProduto";
import GestaoEstoque from "./Pages/GestãoEstoque";

export function Rotas(){
    return(
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Inicial" element={<Home />} />
            <Route path="/cadastro-produto" element={<CadastroProduto />} />
            <Route path="/gestao-estoque" element={<GestaoEstoque />} />
        </Routes>
    )
}