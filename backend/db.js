const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("clients.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, city TEXT)"
  );
});

module.exports = db;