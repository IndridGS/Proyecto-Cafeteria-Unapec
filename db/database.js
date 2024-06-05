// db/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cafeteria.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Campus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        state TEXT NOT NULL
    )`);
});

module.exports = db;
