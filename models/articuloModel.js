// models/articuloModel.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

exports.getAllArticulos = (callback) => {
    const query = 'SELECT * FROM Articulos';
    db.all(query, [], (err, rows) => {
        callback(err, rows);
    });
};

exports.getArticuloById = (id, callback) => {
    const query = 'SELECT * FROM Articulos WHERE id = ?';
    db.get(query, [id], (err, row) => {
        callback(err, row);
    });
};

exports.createArticulo = (articulo, callback) => {
    const query = 'INSERT INTO Articulos (description, marca_id, costo, proveedor_id, existencia, state) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(query, [articulo.description, articulo.marca_id, articulo.costo, articulo.proveedor_id, articulo.existencia, articulo.state], function (err) {
        callback(err, this.lastID);
    });
};

exports.updateArticulo = (id, articulo, callback) => {
    const query = 'UPDATE Articulos SET description = ?, marca_id = ?, costo = ?, proveedor_id = ?, existencia = ?, state = ? WHERE id = ?';
    db.run(query, [articulo.description, articulo.marca_id, articulo.costo, articulo.proveedor_id, articulo.existencia, articulo.state, id], function (err) {
        callback(err);
    });
};

exports.deleteArticulo = (id, callback) => {
    const query = 'DELETE FROM Articulos WHERE id = ?';
    db.run(query, [id], function (err) {
        callback(err);
    });
};
