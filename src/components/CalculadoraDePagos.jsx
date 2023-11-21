// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// eslint-disable-next-line no-unused-vars
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "./CalculadoraDePagos.css";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import db from "../dbClientes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CalculadoraDePagos() {
  const [nombre, setNombre] = useState("");
  const [fechaPrestamo, setFechaPrestamo] = useState(null);
  const [fechaPrimerPago, setFechaPrimerPago] = useState(null);
  const [frecuenciaPago, setFrecuenciaPago] = useState("semanal");
  const [cantidadPrestamo, setCantidadPrestamo] = useState(0);
  const [interes, setInteres] = useState(0.2); // 20% por defecto
  const [cantidadPagos, setCantidadPagos] = useState(1); // Número de pagos
  const [calendarioPagos, setCalendarioPagos] = useState([]);
  const [pagosRealizados, setPagosRealizados] = useState(0);

  const [registros, setRegistros] = useState([]);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [incluyeDomingos, setIncluyeDomingos] = useState(true);

  const tablaPagosRef = useRef(null);
  // Obtén la fecha actual
  const fechaActual = new Date();

  // Define el formato deseado (por ejemplo, "eeee d 'de' MMMM 'de' yyyy")
  const formatoFecha = "eeee d 'de' MMMM 'de' yyyy";

  // Utiliza la función format para obtener la fecha formateada
  const fechaFormateada = format(fechaActual, formatoFecha, { locale: es });

  const cargarDatosGuardados = async () => {
    try {
      const todosLosPagos = await db.pagos.toArray();
      setRegistros(todosLosPagos);
    } catch (error) {
      toast.error("Error al cargar datos");
      console.error("Error al cargar datos desde Dexie:", error);
    }
  };

  useEffect(() => {
    cargarDatosGuardados();
  }, []);

  const existeClienteConPrestamo = () => {
    return registros.some((registro) => registro.nombre === nombre);
  };

  const guardarDatos = async () => {
    if (existeClienteConPrestamo()) {
      alert(
        "Este cliente actualmente tiene un préstamo pendiente y no puede recibir otro préstamo."
      );
      return;
    }

    try {
      await db.pagos.add({
        nombre,
        fechaPrestamo,
        fechaPrimerPago,
        frecuenciaPago,
        cantidadPrestamo,
        interes,
        cantidadPagos,
        calendarioPagos,
        pagosRealizados,
      });
      toast.success("Datos guardados correctamente.");
      console.log("Datos guardados en Dexie");
      limpiarFormulario(); // Limpiar el formulario después de guardar
      cargarDatosGuardados();
    } catch (error) {
      toast.error("Error al guardar datos.");
      console.error("Error al guardar datos en Dexie:", error);
    }
  };

  const actualizarDatos = async () => {
    try {
      await db.pagos.update(registroSeleccionado, {
        nombre,
        fechaPrestamo,
        fechaPrimerPago,
        frecuenciaPago,
        cantidadPrestamo,
        interes,
        cantidadPagos,
        calendarioPagos,
        pagosRealizados,
      });
      toast.success("Datos Actualizados correctamente.");
      console.log("Datos actualizados en Dexie");
      limpiarFormulario();
      cargarDatosGuardados();
    } catch (error) {
      console.error("Error al actualizar datos en Dexie:", error);
      toast.error("Error al actualizar los datos.");
    }
  };

  const eliminarDatos = async () => {
    if (window.confirm("¿Seguro que quieres eliminar este registro?")) {
      try {
        await db.pagos.delete(registroSeleccionado);
        toast.warn("El registro se ha Eliminado.");
        console.log("Registro eliminado de Dexie");
        limpiarFormulario(); // Limpiar el formulario después de eliminar
        cargarDatosGuardados();
      } catch (error) {
        toast.error("Error al Eliminar el registro.");
        console.error("Error al eliminar datos en Dexie:", error);
      }
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setFechaPrestamo(null);
    setFechaPrimerPago(null);
    setFrecuenciaPago("semanal");
    setCantidadPrestamo(0);
    setInteres(0.2);
    setCantidadPagos(1);
    setCalendarioPagos([]);
    setPagosRealizados(0);
    setRegistroSeleccionado(null);
  };

  const handleGuardarClick = () => {
    guardarDatos();
  };

  const handleActualizarClick = () => {
    actualizarDatos();
  };

  const cargarRegistroSeleccionado = (id) => {
    const registro = registros.find((r) => r.id === id);
    if (registro) {
      setNombre(registro.nombre);
      setFechaPrestamo(registro.fechaPrestamo);
      setFechaPrimerPago(registro.fechaPrimerPago);
      setFrecuenciaPago(registro.frecuenciaPago);
      setCantidadPrestamo(registro.cantidadPrestamo);
      setInteres(registro.interes);
      setCantidadPagos(registro.cantidadPagos);
      setCalendarioPagos(registro.calendarioPagos);
      setPagosRealizados(registro.pagosRealizados);
      setRegistroSeleccionado(registro.id);
    }
  };

  // Función para calcular los pagos y generar el calendario de pagos
  const calcularPagos = () => {
    if (cantidadPrestamo <= 0 || interes <= 0 || cantidadPagos <= 0) {
      toast.warn("Por favor, ingresa valores válidos.");
      return;
    }
  
    const montoTotal = cantidadPrestamo * (1 + interes);
    const fechaPagos = [];
    let fechaActual = new Date(fechaPrimerPago);
  
    for (let i = 0; i < cantidadPagos; i++) {
      // Si la opción de incluir domingos está desactivada, omite los domingos
      if (!incluyeDomingos && fechaActual.getDay() === 0 /* Domingo */) {
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
  
      fechaPagos.push(new Date(fechaActual));
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
  
    const montoPorPago = montoTotal / cantidadPagos;
    const calendarioPagos = fechaPagos.map((fecha, index) => ({
      fecha,
      montoPorPago,
      montoPorPagar: montoTotal - index * montoPorPago - montoPorPago,
      estado: index < pagosRealizados ? "✅pagado" : "🔴pendiente",
    }));
  
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
      toast.success("La tabla se ha capturado correctamente.");
    });
  }

  return (
    <div>
      <hr></hr>
      <div>
        <label>Seleccionar Registro:</label>
        <select
          value={registroSeleccionado || ""}
          onChange={(e) => cargarRegistroSeleccionado(Number(e.target.value))}
        >
          <option value="" disabled>
            -- Seleccionar Registro --
          </option>
          {registros.map((registro) => (
            <option key={registro.id} value={registro.id}>
              {registro.nombre}
            </option>
          ))}
        </select>
      </div>
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
        <label>
          Incluir pagos los domingos:
          <input
            type="checkbox"
            checked={incluyeDomingos}
            onChange={() => setIncluyeDomingos(!incluyeDomingos)}
          />
        </label>
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

      <div className="contenedor-boton">
        <button onClick={calcularPagos} className="boton-calcular">
          Calcular Pagos
        </button>
      </div>

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
            <td
              className="titulo-valor"
              colSpan={3}
              style={{ textAlign: "center" }}
            >
              $ {formatNumberWithCommas(cantidadPrestamo * (1 + interes))}.00{" "}
              <hr></hr>En {cantidadPagos} Pagos de ${" "}
              {formatNumberWithCommas(
                (cantidadPrestamo * (1 + interes)) / cantidadPagos
              )}
              .00
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
                {format(pago.fecha, "EE d 'de' MMM 'de' y", { locale: es })}
              </td>
              <td className="montopago">
                {pago.omitido
                  ? "-"
                  : `$ ${formatNumberWithCommas(pago.montoPorPago)}.00`}
              </td>
              <td className="resta">
                {pago.omitido
                  ? "-"
                  : `$ ${formatNumberWithCommas(pago.montoPorPagar)}.00`}
              </td>
              <td className="resta">{pago.estado}</td>
            </tr>
          ))}

          <tr>
            <td colSpan={5} className="fecha-actual">
              {fechaFormateada}
            </td>
          </tr>
          {calendarioPagos.map((pago, index) => (
            <tr key={index}>
              {index == pagosRealizados - 1 && (
                <td className="ha-pagado" colSpan={5}>
                  Usted ha pagado: ${" "}
                  {formatNumberWithCommas(
                    cantidadPrestamo * (1 + interes) - pago.montoPorPagar
                  )}
                  .00{" ("}
                  {pagosRealizados}
                  {" Pagos)"}
                </td>
              )}
            </tr>
          ))}
          {calendarioPagos.map((pago, index) => (
            <tr key={index}>
              {index == pagosRealizados - 1 && (
                <td className="debe-hoy" colSpan={5}>
                  Usted debe hoy: $ {formatNumberWithCommas(pago.montoPorPagar)}
                  .00{" ("}
                  {cantidadPagos - pagosRealizados}
                  {" Pagos)"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="contenedor-boton">
        <button onClick={handleGuardarClick} className="boton-guardar">
          Guardar
        </button>
        <button onClick={handleActualizarClick} className="boton-actualizar">
          Actualizar
        </button>
        <button onClick={eliminarDatos} className="boton-eliminar">
          Eliminar
        </button>
      </div>
      <div className="contenedor-boton">
        <button onClick={capturarTabla} className="boton-capturar">
          Capturar <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>
        </button>
      </div>
    </div>
  );
}

export default CalculadoraDePagos;
