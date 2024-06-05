// models/empleadoModel.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

class EmpleadoModel {
    static getAll(callback) {
        const query = 'SELECT * FROM Empleados';
        db.all(query, [], (err, rows) => {
            callback(err, rows);
        });
    }

    static getById(id, callback) {
        const query = 'SELECT * FROM Empleados WHERE id = ?';
        db.get(query, [id], (err, row) => {
            callback(err, row);
        });
    }

    static create(data, callback) {
        const { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state } = data;
        const query = 'INSERT INTO Empleados (nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(query, [nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state], function (err) {
            callback(err, this.lastID);
        });
    }

    static update(id, data, callback) {
        const { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state } = data;
        const query = 'UPDATE Empleados SET nombre = ?, cedula = ?, tanda_labor = ?, porciento_comision = ?, fecha_ingreso = ?, state = ? WHERE id = ?';
        db.run(query, [nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state, id], function (err) {
            callback(err);
        });
    }

    static delete(id, callback) {
        const query = 'DELETE FROM Empleados WHERE id = ?';
        db.run(query, [id], function (err) {
            callback(err);
        });
    }
}

module.exports = EmpleadoModel;
