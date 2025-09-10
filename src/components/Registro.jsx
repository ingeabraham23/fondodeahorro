// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import db from "../db";
import "./Registro.css";

const nombresDisponibles = [
  "Abraham",
  "David",
  "Eloy",
  "Enrique",
  "Heriberto",
  "Lobo",
  "Marco",
];

function AgregarPersona() {
  const [nuevaPersona, setNuevaPersona] = useState({
    nombre: "",
    cooperacion: 200,
    fecha: new Date(),
  });

  const [personas, setPersonas] = useState([]);

  // Cargar registros al inicio
  useEffect(() => {
    const fetchPersonas = async () => {
      const data = await db.personas.toArray();
      setPersonas(data);
    };
    fetchPersonas();
  }, []);

  const handleInputChange = (event, field) => {
    const value =
      field === "cooperacion"
        ? parseFloat(event.target.value) || 0
        : event.target.value;
    setNuevaPersona({ ...nuevaPersona, [field]: value });
  };

  const handleFechaChange = (date) => {
    setNuevaPersona({ ...nuevaPersona, fecha: date });
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  const handleAgregarPersona = async () => {
    try {
      const id = await db.personas.add(nuevaPersona);
      setPersonas([...personas, { ...nuevaPersona, id }]);
      setNuevaPersona({
        nombre: "",
        cooperacion: 200,
        fecha: nuevaPersona.fecha,
      });
    } catch (error) {
      console.error("Error al agregar la persona a la tabla de Dexie:", error);
    }
  };

  const handleEliminarPersona = async (id) => {
    try {
      await db.personas.delete(id);
      setPersonas(personas.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar persona:", error);
    }
  };

  return (
    <div className="add-person-container">
      <h3>Agregar Persona</h3>
      <div className="form-group">
        <label className="label" htmlFor="nombreInput">
          Nombre:
        </label>
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

      {/* Cooperación con botón para invertir signo */}
      <div>
        <label className="label" htmlFor="cooperacionInput">
          Cooperación:
        </label>
        <div className="input-group">
          <input
            className="input"
            id="cooperacionInput"
            type="number"
            step="any"
            min="0"
            value={Math.abs(nuevaPersona.cooperacion)}
            onChange={(e) =>
              setNuevaPersona({
                ...nuevaPersona,
                cooperacion: (parseFloat(e.target.value) || 0) *
                  (nuevaPersona.cooperacion < 0 ? -1 : 1),
              })
            }
          />
          <button
            type="button"
            className={`sign-button ${nuevaPersona.cooperacion >= 0 ? "positivo" : "negativo"
              }`}
            onClick={() =>
              setNuevaPersona({
                ...nuevaPersona,
                cooperacion: nuevaPersona.cooperacion * -1,
              })
            }
          >
            {nuevaPersona.cooperacion >= 0 ? "➕ Aporte" : "➖ Retiro"}
          </button>
        </div>
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

      <button className="add-button" onClick={handleAgregarPersona}>
        Agregar Persona
      </button>

      {/* Lista de personas */}
      <h3>Registros</h3>
      <ul className="lista-personas">
        {personas.map((p) => (
          <li key={p.id} className="persona-item">
            <span>
              <strong>{p.nombre}</strong> - {p.cooperacion} pesos -{" "}
              {formatDate(new Date(p.fecha))}
            </span>
            <button
              className="delete-button"
              onClick={() => handleEliminarPersona(p.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AgregarPersona;
