// db.js
import Dexie from 'dexie';

const db = new Dexie("ClientesDB");
db.version(1).stores({
  pagos: "++id, nombre",
});

export default db;