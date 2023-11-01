// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from 'react';
import html2canvas from "html2canvas";
import './Calculos.css';

function CalculadoraDePrestamo() {
  const tablaRef = useRef(null);

  const [cantidadPrestada, setCantidadPrestada] = useState(0);
  const [interes, setInteres] = useState(0.20); // 20% por defecto
  const [aportes, setAportes] = useState({
    Abraham: 0,
    Eloy: 0,
    Enrique: 0,
    David: 0,
    Marco: 0,
    Heriberto: 0,
    Lobo: 0,
  });

  const handleCantidadPrestadaChange = (event) => {
    setCantidadPrestada(parseFloat(event.target.value));
  };

  const handleInteresChange = (event) => {
    setInteres(parseFloat(event.target.value) / 100);
  };

  const handleAporteChange = (nombre, valor) => {
    const newAportes = { ...aportes };
    newAportes[nombre] = parseFloat(valor);
    setAportes(newAportes);
  };

  const calcularPorcentaje = (aporte, total) => {
    return ((aporte / total) * 100).toFixed(2);
  };

  const calcularGanancia = (cantidadPrestada, interes) => {
    return cantidadPrestada * interes;
  };

  const calcularDistribucionGanancia = (ganancia) => {
    const sumaAportes = Object.values(aportes).reduce((total, aporte) => total + aporte, 0);
    const distribucion = {};
    for (const nombre in aportes) {
      distribucion[nombre] = (ganancia * (aportes[nombre] / sumaAportes)).toFixed(2);
    }
    return distribucion;
  };

  const calcularSumaAportes = () => {
    return Object.values(aportes).reduce((total, aporte) => total + aporte, 0);
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const ganancia = calcularGanancia(cantidadPrestada, interes);
  const distribucionGanancia = calcularDistribucionGanancia(ganancia);
  const sumaAportes = calcularSumaAportes();

  function capturarTabla() {
    const tabla = tablaRef.current;
    html2canvas(tabla).then(function (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = 'calculo.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }

  return (
    <div>
      <hr />
      <div>
        <label htmlFor="cantidadPrestada">Cantidad Prestada:</label>
        <input
          type="number"
          id="cantidadPrestada"
          value={cantidadPrestada}
          onChange={handleCantidadPrestadaChange}
          className="input-cantidad-prestada"
        />
      </div>
      <div>
        <label htmlFor="interes">Interés (%):</label>
        <input
          type="number"
          id="interes"
          value={interes * 100}
          onChange={handleInteresChange}
          className="input-interes"
        />
      </div>
      <div>
        <hr />
        <h3>Aportes:</h3>
        {Object.keys(aportes).map((nombre) => (
          <div key={nombre}>
            <label htmlFor={nombre} className="nombre-input">
              {nombre}:
            </label>
            <input
              type="number"
              id={nombre}
              value={aportes[nombre]}
              onChange={(event) => handleAporteChange(nombre, event.target.value)}
              className="aporte-input"
            />
            <span>{calcularPorcentaje(aportes[nombre], cantidadPrestada)}%</span>
          </div>
        ))}
      </div>
      <div>
        <p>Suma de Aportes: {sumaAportes}</p>
        <hr />
        <p>Ganancia: {ganancia}</p>
        <p>Distribución de la Ganancia:</p>
        <ul>
          {Object.keys(distribucionGanancia).map((nombre) => (
            <li key={nombre}>
              {nombre}: {distribucionGanancia[nombre]}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <table className="tabla-vista" ref={tablaRef}>
          <tbody>
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }} className="titulo-calculos">
                Prestamo:
              </td>
            </tr>
            <tr>
              <td className="prestamo">Cantidad prestada:</td>
              <td className="prestamo" colSpan={2}>
                $ {formatNumberWithCommas(cantidadPrestada)}.00
              </td>
            </tr>
            <tr>
              <td className="prestamo">Interés (Porcentaje):</td>
              <td className="prestamo" colSpan={2}>{interes * 100}%</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }} className="titulo-calculos">
                Aportes:
              </td>
            </tr>
            {Object.keys(aportes).map((nombre) => (
              <tr key={nombre}>
                <td className="aporte">{nombre}:</td>
                <td className="aporte-cantidad">
                  $ {formatNumberWithCommas(aportes[nombre])}.00
                </td>
                <td className='porcentaje'>
                {calcularPorcentaje(aportes[nombre], cantidadPrestada)}%
                </td>
              </tr>
            ))}
            <tr>
              <td className="total">Total:</td>
              <td className="total">
                $ {formatNumberWithCommas(sumaAportes)}.00
              </td>
              <td className='total'>100.00%</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }} className="titulo-calculos">
                Distribucion de ganancias:
              </td>
            </tr>
            {Object.keys(distribucionGanancia).map((nombre) => (
              <tr key={nombre}>
                <td className="aporte">{nombre}:</td>
                <td className="aporte-cantidad">
                  $ {formatNumberWithCommas(distribucionGanancia[nombre])}
                </td>
                <td className='porcentaje'>{calcularPorcentaje(aportes[nombre], cantidadPrestada)}%</td>
              </tr>
            ))}
            <tr>
              <td className="total">Total:</td>
              <td className="total">
                $ {formatNumberWithCommas(ganancia)}.00
              </td>
              <td className='total'>
                100.00%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={capturarTabla} >Capturar</button>
    </div>
  );
}

export default CalculadoraDePrestamo;
