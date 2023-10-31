// eslint-disable-next-line no-unused-vars
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Calendario from "./components/Calendario";
import Registro from "./components/Registro";
import TablaReporte from "./components/Reporte";
import RespaldoYRestauracion from "./components/RespaldoYRestauracion";
import CalculadoraDePrestamo from "./components/Calculos";
import CalculadoraDePagos from "./components/CalculadoraDePagos";

function App() {
  return (
    <HashRouter>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Calendario />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/reporte" element={<TablaReporte />} />
            <Route path="/respaldo" element={<RespaldoYRestauracion />} />
            <Route path="/calculos" element={<CalculadoraDePrestamo />} />
            <Route path="/pagos" element={<CalculadoraDePagos />} />
          </Routes>
        </div>
    </HashRouter>
  );
}

export default App;