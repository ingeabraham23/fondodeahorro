import Dexie from "dexie";

const database = new Dexie("RegistroFondo");
database.version(1).stores({
  personas: "++id, nombre",

});

export default database;