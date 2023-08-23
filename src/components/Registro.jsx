// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import db from "../db";
import "./Registro.css"

const nombresDisponibles = ["Abraham", "David", "Eloy", "Enrique", "Heriberto", "Lobo", "Marco"];

function AgregarPersona() {

  const [nuevaPersona, setNuevaPersona] = useState({
    nombre: "",
    cooperacion: 100,
    fecha: new Date(),
  });

  const handleInputChange = (event, field) => {
    const value = field === "cooperacion" ? parseInt(event.target.value, 10) : event.target.value;
    setNuevaPersona({ ...nuevaPersona, [field]: value });
  };

  const handleFechaChange = (date) => {
    setNuevaPersona({ ...nuevaPersona, fecha: date });
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString("es-ES", options);
  };

  const handleAgregarPersona = async () => {
    try {
      await db.personas.add(nuevaPersona);
      setNuevaPersona({
        nombre: "",
        cooperacion: 100,
        fecha: nuevaPersona.fecha, // Mantener la fecha seleccionada
      });
      console.log("Persona agregada a la tabla de Dexie");
    } catch (error) {
      console.error("Error al agregar la persona a la tabla de Dexie:", error);
    }
  };

  return (
    <div className="add-person-container">
      <h3>Agregar Persona</h3>
      <div className="form-group">
        <label className="label" htmlFor="nombreInput">Nombre:</label>
        <select
        className="select"
          id="nombreInput"
          value={nuevaPersona.nombre}
          onChange={(e) => handleInputChange(e, "nombre")}
        >
          <option value="">Seleccione un nombre</option>
          {nombresDisponibles.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="cooperacionInput">Cooperación:</label>
        <input className="input"
          id="cooperacionInput"
          type="number"
          value={nuevaPersona.cooperacion}
          onChange={(e) => handleInputChange(e, "cooperacion")}
        />
      </div>
      <div>
        <label className="label">Fecha:</label>
        <DatePicker
          selected={nuevaPersona.fecha}
          onChange={handleFechaChange}
          dateFormat="MMMM d, yyyy"
          className="date-picker"
        />
      </div>
      <p>Fecha formateada: {formatDate(new Date(nuevaPersona.fecha))}</p>
      <button className="add-button" onClick={handleAgregarPersona}>Agregar Persona</button>
    </div>
  );
}

export default AgregarPersona;


