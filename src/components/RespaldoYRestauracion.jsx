// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import db from "../db";

function RespaldoYRestauracion() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleBackup = async () => {
    try {
      // Abre la conexión a la base de datos
      await db.open();
      const personas = await db.personas.toArray();
      const jsonData = JSON.stringify(personas, null, 2);

      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.json";
      a.click();

      console.log("Base de datos respaldada correctamente");
    } catch (error) {
      console.error("Error al respaldar la base de datos:", error);
    }
  };

  const handleRestore = async () => {
    try {
      // Abre la conexión a la base de datos
      await db.open();
      if (selectedFile) {
        const fileContent = await selectedFile.text();
        const parsedData = JSON.parse(fileContent);

        // Borrar todos los registros actuales antes de restaurar
        await db.personas.clear();

        // Insertar los nuevos registros desde el archivo JSON
        await db.personas.bulkAdd(parsedData);

        console.log("Base de datos restaurada correctamente");
      }
    } catch (error) {
      console.error("Error al restaurar la base de datos:", error);
    }
  };

  return (
    <div>
      <h3>Respaldar y Restaurar Base de Datos</h3>
      <div>
        <label htmlFor="backupFile">Seleccionar archivo de respaldo:</label>
        <input
          type="file"
          id="backupFile"
          accept=".json"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <button onClick={handleBackup}>Crear respaldo</button>
        <button onClick={handleRestore}>Restaurar respaldo</button>
      </div>
    </div>
  );
}

export default RespaldoYRestauracion;
