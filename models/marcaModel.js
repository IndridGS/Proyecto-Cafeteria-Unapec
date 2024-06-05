// models/marcaModel.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Marcas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        state TEXT NOT NULL
    )`);
});

module.exports = db;
