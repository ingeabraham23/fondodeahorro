// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import db from "../db";
import "./Reporte.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  faCamera,
  faCircleArrowDown,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TablaReporte() {
  const [reportes, setReportes] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [password, setPassword] = useState("");
  const [showTable, setShowTable] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  const tableRef = useRef(null);

  useEffect(() => {
    // Función para obtener los datos de la tabla reporte
    const fetchReportes = async () => {
      try {
        const reportesData = await db.personas.toArray();
        setReportes(reportesData);
      } catch (error) {
        console.error("Error al obtener los datos del reporte:", error);
      }
    };

    fetchReportes();
  }, []);


  const handleFiltroNombre = (e) => {
    setFiltroNombre(e.target.value);
  };


  // Función para filtrar los datos por número de unidad y ruta
  const filtrarDatos = (reportes) => {
    return reportes.filter((reporte) => {
      const nombreLowerCase = reporte.nombre.toLowerCase(); // Convertir el nombre a minúsculas
      const filtroLowerCase = filtroNombre.toLowerCase(); // Convertir el filtro a minúsculas
      return filtroLowerCase === "" || nombreLowerCase.includes(filtroLowerCase);
    }).map((reporte) => ({
      ...reporte,
      fecha: new Date(reporte.fecha).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));
  };
  
  

  const reportesFiltrados = filtrarDatos(reportes);

  const handleDownloadPDF = () => {
    const input = tableRef.current;

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setProperties({ title: "Reporte" });

    const totalPagesExp = "{total_pages_count_string}";
    const fontSize = 12; // Tamaño de fuente deseado para toda la tabla
    const headerTextColor = "#FFFFFF"; // Color de texto para el encabezado (por ejemplo, blanco)
    const headerFillColor = "#3498DB"; // Color de fondo para el encabezado (por ejemplo, azul)
    const bodyTextColor = "#000000"; // Color de texto para el cuerpo (por ejemplo, negro)
    const bodyFillColor = "#FFFFFF"; // Color de fondo para el cuerpo (por ejemplo, blanco)

    const borderLineWidth = 0.3; // Grosor de línea deseado
    const borderColor = "#000000"; // Color de borde deseado (por ejemplo, negro)

    // Generar la tabla
    pdf.autoTable({
      html: input,
      margin: { top: 20 },
      theme: "grid",
      headStyles: {
        fontSize: 14,
        textColor: headerTextColor,
        fillColor: headerFillColor,
      },
      styles: {
        fontSize: fontSize,
        textColor: bodyTextColor,
        fillColor: bodyFillColor,
        lineWidth: borderLineWidth,
        lineColor: borderColor,
      },
      didParseCell: function (data) {
        if (data.row.section === "body") {
          const color = data.row.raw[6].content;
          console.log(data.row.raw[6].content);

          data.cell.styles.fillColor = color;
        }
      },
      // eslint-disable-next-line no-unused-vars
      didDrawPage: (data) => pdf.putTotalPages(totalPagesExp),
    });
    // Obtener la fecha y hora actual
    const currentDate = new Date();

    // Obtener los nombres de los días y meses en español
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    // Función para convertir la hora de formato 24 horas a formato de 12 horas
    const get12HourFormat = (hour) => {
      return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    };
    // Formatear la fecha y hora actual en el formato deseado
    const dayOfWeek = days[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const hours = get12HourFormat(currentDate.getHours());
    const minutesWithLeadingZero = currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0");

    const amOrPm = currentDate.getHours() >= 12 ? "pm" : "am";
    const formattedDate = `Reporte de Ahorro ${dayOfWeek} ${dayOfMonth} de ${month} de ${year} a las ${hours}.${minutesWithLeadingZero} ${amOrPm}`;

    // Guardar el PDF con el nombre de archivo formateado
    const filename = `${formattedDate}.pdf`;
    pdf.save(filename);
  };

  const handleDownloadImage = () => {
    const input = tableRef.current;

    // Obtener la fecha y hora actual
    const currentDate = new Date();

    // Obtener los nombres de los días y meses en español
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    // Función para convertir la hora de formato 24 horas a formato de 12 horas
    const get12HourFormat = (hour) => {
      return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    };
    // Formatear la fecha y hora actual en el formato deseado
    const dayOfWeek = days[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const hours = get12HourFormat(currentDate.getHours());
    const minutesWithLeadingZero = currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0");

    const amOrPm = currentDate.getHours() >= 12 ? "pm" : "am";
    const formattedDate = `Reporte de Ahorro ${dayOfWeek} ${dayOfMonth} de ${month} de ${year} a las ${hours}.${minutesWithLeadingZero} ${amOrPm}`;

    // Guardar el IMAGEN con el nombre de archivo formateado
    const filename = `${formattedDate}`;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = filename + ".png";
      link.href = imgData;
      link.click();
    });
  };

  const handleGoToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  const totalCooperacion = reportesFiltrados.reduce((total, reporte) => total + reporte.cooperacion, 0);

  const handleShowTable = () => {
    // Aquí puedes validar la contraseña, por ejemplo, comparándola con una contraseña predefinida.
    // Si la contraseña es válida, muestra la tabla.
    if (password === "purosreyes") {
      setShowTable(true);
    } else {
      alert("Contraseña incorrecta. Inténtalo de nuevo.");
    }
  };

  if (!showTable) {
    return (
      <div>
        <h3>Ingrese la contraseña para ver los datos:</h3>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button onClick={handleShowTable}>Mostrar Datos</button>
      </div>
    );
  }

  return (
    <div>
      <div className="filtros">
        <input
          type="text"
          className="filtro-numero"
          placeholder="Nombre"
          value={filtroNombre}
          onChange={handleFiltroNombre}
          inputMode="text" /* Teclado numérico */
        />
      </div>
      <table ref={tableRef} className="tabla-reporte">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Cooperacion</th>
            <th>Fecha</th>

          </tr>
        </thead>
        <tbody>
          {reportesFiltrados.reverse().map((reporte, index) => (
            <tr key={reporte.id} style={{ backgroundColor: reporte.color }}>
              <td style={{ backgroundColor: "#00ECFF" }}>{index + 1}</td>
              <td>{reporte.nombre}</td>
              <td>{reporte.cooperacion}</td>
              <td>{reporte.fecha}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td className="total-label">Total:</td>
            <td className="total-value">{totalCooperacion}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div className="botones-flotantes">
        <button className="boton-pdf" onClick={handleDownloadPDF}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="boton-imagen" onClick={handleDownloadImage}>
          <FontAwesomeIcon icon={faCamera} />
        </button>
        <button className="boton-ir-abajo" onClick={handleGoToBottom}>
          <FontAwesomeIcon icon={faCircleArrowDown} />
        </button>
      </div>
    </div>
  );
}

export default TablaReporte;
