/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import es from 'date-fns/locale/es';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendario.css'

import { format } from 'date-fns'; // Importa la función format de date-fns

registerLocale('es', es);

function Calendario() {
  const fechaActual = new Date(); // Obtiene la fecha actual
  const diaCero = new Date(2023, 10, 25); // 25 de noviembre de 2023

  // Calcula las fechas y ahorros desde diaCero hasta la fecha límite
  const calcularFechasYAhorros = (fechaInicio, fechaLimite) => {
    const fechasYAhorros = [];
    const diasParaAgregar = 7;
    let fechaActual = new Date(fechaInicio);
    let ahorro = 100;
    let grupal;

    while (fechaActual <= fechaLimite) {
      fechasYAhorros.push({ fecha: fechaActual.toDateString(), ahorro });
      fechaActual.setDate(fechaActual.getDate() + diasParaAgregar);
      ahorro += 100; // Ejemplo de incremento del ahorro cada 8 días
    }

    grupal = ahorro * 7;
    return fechasYAhorros;
  };


  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaActual);
  const fechaLimite = fechaSeleccionada > fechaActual ? fechaSeleccionada : fechaActual;
  const fechasYAhorros = calcularFechasYAhorros(diaCero, fechaLimite);

  function manejarFechaSeleccionada(fecha) {
    setFechaSeleccionada(fecha);
  }

  return (
    <div className="app-container">
      <DatePicker
        selected={fechaSeleccionada}
        showIcon
        withPortal
        onChange={manejarFechaSeleccionada}
        locale="es"
        onFocus={(e) => {
          e.target.readOnly = true;
          e.target.blur();
        }}
      />

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Individual</th>
              <th>Ahorro</th>
            </tr>
          </thead>
          <tbody>
            {fechasYAhorros.map((item, index) => (
              <tr key={index}>
                <td>{format(new Date(item.fecha), 'eeee dd MMMM yyyy', { locale: es })}</td>
                <td>{item.ahorro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <table className="custom-table2">
          <thead>
            <tr>
              <th>Grupal</th>
              <th>Ahorro</th>
            </tr>
          </thead>
          <tbody>
            {fechasYAhorros.map((item, index) => (
              <tr key={index}>
                <td>{format(new Date(item.fecha), 'eeee dd MMMM yyyy', { locale: es })}</td>
                <td>{item.ahorro * 7}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ol>
        <li>Cualquier integrante se puede retirar cuando guste.</li>
        <li>Si alguien necesita un prestamo se puede tomar del total Grupal.</li>
        <li>A fin de año se puede tomar la cantidad que todos acuerden.</li>
      </ol>
    </div>
  );
}

export default Calendario;