const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

class TipoUsuarioModel {
    static getAll(callback) {
        const query = 'SELECT * FROM TiposUsuarios';
        db.all(query, [], (err, rows) => {
            callback(err, rows);
        });
    }

    static getById(id, callback) {
        const query = 'SELECT * FROM TiposUsuarios WHERE id = ?';
        db.get(query, [id], (err, row) => {
            callback(err, row);
        });
    }

    static create(description, state, callback) {
        const query = 'INSERT INTO TiposUsuarios (description, state) VALUES (?, ?)';
        db.run(query, [description, state], function(err) {
            callback(err, this.lastID);
        });
    }

    static update(id, description, state, callback) {
        const query = 'UPDATE TiposUsuarios SET description = ?, state = ? WHERE id = ?';
        db.run(query, [description, state, id], function(err) {
            callback(err);
        });
    }

    static delete(id, callback) {
        const query = 'DELETE FROM TiposUsuarios WHERE id = ?';
        db.run(query, [id], function(err) {
            callback(err);
        });
    }
}

module.exports = TipoUsuarioModel;
