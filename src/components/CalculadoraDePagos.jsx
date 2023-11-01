// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// eslint-disable-next-line no-unused-vars
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "./CalculadoraDePagos.css";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CalculadoraDePagos() {
  const [nombre, setNombre] = useState();

  const [fechaPrestamo, setFechaPrestamo] = useState(null);
  const [fechaPrimerPago, setFechaPrimerPago] = useState(null);
  const [frecuenciaPago, setFrecuenciaPago] = useState("semanal");
  const [cantidadPrestamo, setCantidadPrestamo] = useState(0);
  const [interes, setInteres] = useState(0.2); // 20% por defecto
  const [cantidadPagos, setCantidadPagos] = useState(1); // Número de pagos
  const [calendarioPagos, setCalendarioPagos] = useState([]);
  const [pagosRealizados, setPagosRealizados] = useState(0);

  const tablaPagosRef = useRef(null);
  // Función para calcular los pagos y generar el calendario de pagos
  const calcularPagos = () => {
    if (cantidadPrestamo <= 0 || interes <= 0 || cantidadPagos <= 0) {
      alert("Por favor, ingresa valores válidos.");
      return;
    }

    // Calcula el monto total a pagar, incluyendo el interés
    const montoTotal = cantidadPrestamo * (1 + interes);

    // Calcula la fecha de cada pago en base a la frecuencia y la fecha del primer pago
    const fechaPagos = [];
    const fechaActual = new Date(fechaPrimerPago);
    if (frecuenciaPago === "diario") {
      for (let i = 0; i < cantidadPagos; i++) {
        fechaPagos.push(new Date(fechaActual));
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    } else if (frecuenciaPago === "semanal") {
      for (let i = 0; i < cantidadPagos; i++) {
        fechaPagos.push(new Date(fechaActual));
        fechaActual.setDate(fechaActual.getDate() + 7);
      }
    }

    // Calcula el monto a pagar en cada fecha
    const montoPorPago = montoTotal / cantidadPagos;

    // Genera el calendario de pagos
    const calendarioPagos = fechaPagos.map((fecha, index) => ({
      fecha,
      montoPorPago: montoPorPago,
      montoPorPagar: montoTotal - index * montoPorPago - montoPorPago,
      estado: index < pagosRealizados ? "✅pagado" : "🔴pendiente",
    }));

    // Aquí puedes hacer algo con el calendario de pagos (por ejemplo, mostrarlo en el componente)
    setCalendarioPagos(calendarioPagos);
    console.log(calendarioPagos);
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  function capturarTabla() {
    const tabla = tablaPagosRef.current;
    html2canvas(tabla).then(function (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "pagos.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }

  return (
    <div>
      <hr></hr>
      <div>
        <label>Cliente:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div>
        <label>Fecha del Préstamo:</label>
        <DatePicker
          placeholderText="Click para seleccionar la fecha del Prestamo"
          showIcon
          withPortal
          selected={fechaPrestamo}
          onChange={(date) => setFechaPrestamo(date)}
          onFocus={(e) => {
            e.target.readOnly = true;
            e.target.blur();
          }}
          dateFormat="EEEE d 'de' MMMM 'de' y"
          locale={es}
        />
      </div>
      <div>
        <label>Fecha del Primer Pago:</label>
        <DatePicker
          placeholderText="Click para seleccionar la fecha del Primer Pago"
          showIcon
          withPortal
          selected={fechaPrimerPago}
          onChange={(date) => setFechaPrimerPago(date)}
          onFocus={(e) => {
            e.target.readOnly = true;
            e.target.blur();
          }}
          dateFormat="EEEE d 'de' MMMM 'de' y"
          locale={es}
        />
      </div>
      <div>
        <label>Frecuencia de Pago:</label>
        <select
          value={frecuenciaPago}
          onChange={(e) => setFrecuenciaPago(e.target.value)}
        >
          <option value="semanal">Semanal</option>
          <option value="diario">Diario</option>
        </select>
      </div>
      <div>
        <label>Cantidad del Préstamo:</label>
        <input
          type="number"
          value={cantidadPrestamo}
          onChange={(e) => setCantidadPrestamo(e.target.value)}
        />
      </div>
      <div>
        <label>Porcentaje de Interés (%):</label>
        <input
          type="number"
          value={interes * 100}
          onChange={(e) => setInteres(e.target.value / 100)}
        />
      </div>
      <div>
        <label>Número de Pagos:</label>
        <input
          type="number"
          value={cantidadPagos}
          onChange={(e) => setCantidadPagos(e.target.value)}
        />
      </div>
      <div>
        <label>Pagos Realizados:</label>
        <input
          type="number"
          value={pagosRealizados}
          onChange={(e) => setPagosRealizados(e.target.value)}
        />
      </div>
      <hr></hr>
      <button onClick={calcularPagos}>Calcular Pagos</button>

      <table className="tabla-pagos" ref={tablaPagosRef}>
        <thead>
          <tr>
            <td className="titulo" colSpan={2}>
              Cliente:
            </td>
            <td className="titulo-valor" colSpan={3}>
              {nombre}
            </td>
          </tr>
          <tr>
            <td className="titulo" colSpan={2}>
              Prestamo:
            </td>
            <td className="titulo-valor" colSpan={3}>
              $ {formatNumberWithCommas(cantidadPrestamo)}.00
            </td>
          </tr>
          <tr>
            <td className="titulo" colSpan={2}>
              Interés:
            </td>
            <td className="titulo-valor" colSpan={3}>
              {interes * 100}%
            </td>
          </tr>
          <tr>
            <td className="titulo" colSpan={2}>
              Total a pagar:
            </td>
            <td className="titulo-valor" colSpan={3} style={{textAlign:"center"}}>
              $ {formatNumberWithCommas(cantidadPrestamo * (1 + interes))}.00 <hr></hr>En {cantidadPagos} Pagos de $ {formatNumberWithCommas((cantidadPrestamo * (1 + interes)) / cantidadPagos)}.00
            </td>
          </tr>
          <tr>
            <td className="titulo" colSpan={2}>
              Fecha del prestamo:
            </td>
            <td colSpan={3} className="titulo-valor">
              {fechaPrestamo
                ? format(fechaPrestamo, "EEEE d 'de' MMMM 'de' y", {
                    locale: es,
                  })
                : "Fecha no seleccionada"}
            </td>
          </tr>
          <tr className="cabecera">
            <th colSpan={2}>Fecha</th>
            <th>Pago</th>
            <th>Resta</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {calendarioPagos.map((pago, index) => (
            <tr key={index}>
              <td colSpan={2} className="fechapago">
                {format(pago.fecha, "EEEE d 'de' MMMM 'de' y", { locale: es })}
              </td>
              <td className="montopago">
                ${formatNumberWithCommas(pago.montoPorPago)}
              </td>
              <td className="resta">
                ${formatNumberWithCommas(pago.montoPorPagar)}
              </td>
              <td className="resta">{pago.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={capturarTabla}>
        Capturar <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>
      </button>
    </div>
  );
}

export default CalculadoraDePagos;
