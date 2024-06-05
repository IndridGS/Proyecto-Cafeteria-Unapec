const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

class Usuario {
    static getAll(callback) {
        db.all('SELECT * FROM Usuarios', [], (err, rows) => {
            callback(err, rows);
        });
    }

    static getById(id, callback) {
        db.get('SELECT * FROM Usuarios WHERE id = ?', [id], (err, row) => {
            callback(err, row);
        });
    }

    static create(data, callback) {
        const { nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state } = data;
        db.run('INSERT INTO Usuarios (nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state) VALUES (?, ?, ?, ?, ?, ?)', [nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state], function (err) {
            callback(err, this.lastID);
        });
    }

    static update(id, data, callback) {
        const { nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state } = data;
        db.run('UPDATE Usuarios SET nombre = ?, cedula = ?, tipo_usuario_id = ?, limite_credito = ?, fecha_registro = ?, state = ? WHERE id = ?', [nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state, id], (err) => {
            callback(err);
        });
    }

    static delete(id, callback) {
        db.run('DELETE FROM Usuarios WHERE id = ?', [id], (err) => {
            callback(err);
        });
    }
}

module.exports = Usuario;
