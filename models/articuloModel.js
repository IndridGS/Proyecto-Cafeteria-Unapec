//articuloModel.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

exports.getAllArticulos = (callback) => {
    const query = 'SELECT * FROM Articulos';
    db.all(query, [], (err, rows) => {
        callback(err, rows);
    });
};


exports.getAvailableArticulos = (callback) => {
    const query = 'SELECT * FROM Articulos WHERE state = "Disponible"';
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

// Método para obtener un artículo por su ID
exports.getById = (id, callback) => {
    const query = 'SELECT * FROM Articulos WHERE id = ?';
    db.get(query, [id], (err, row) => {
        callback(err, row);
    });
};

exports.updateExistencia = (id, unidadesVendidas, callback) => {
    const query = 'UPDATE Articulos SET existencia = existencia + ? WHERE id = ?';
    db.run(query, [unidadesVendidas, id], function (err) {
        callback(err);
    });
};

//Funcion para obtener la existencia del articulo por su ID
exports.getExistenciaById = (id, callback) => {
    const query = 'SELECT existencia FROM Articulos WHERE id = ?';
    db.get(query, [id], (err, row) => {
        callback(err, row ? row.existencia : null);
    });
};
