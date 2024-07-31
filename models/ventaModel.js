// models/ventaModel.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

const VentaModel = {
    getAll: (callback) => {
        const query = `
            SELECT v.id, v.no_factura, e.nombre AS empleado_nombre, a.description AS articulo_description, u.nombre AS usuario_nombre, v.fecha_venta, v.monto, v.unidades_vendidas, v.comentario, v.estado
            FROM Ventas v
            JOIN Empleados e ON v.empleado_id = e.id
            JOIN Articulos a ON v.articulo_id = a.id
            JOIN Usuarios u ON v.usuario_id = u.id
        `;
        db.all(query, [], (err, rows) => {
            callback(err, rows);
        });
    },

    getById: (id, callback) => {
        const query = 'SELECT * FROM Ventas WHERE id = ?';
        db.get(query, [id], (err, row) => {
            callback(err, row);
        });
    },

    create: (venta, callback) => {
        const query = 'INSERT INTO Ventas (no_factura, empleado_id, articulo_id, usuario_id, fecha_venta, monto, unidades_vendidas, comentario, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(query, [venta.no_factura, venta.empleado_id, venta.articulo_id, venta.usuario_id, venta.fecha_venta, venta.monto, venta.unidades_vendidas, venta.comentario, venta.estado], function (err) {
            callback(err, this.lastID);
        });
    },

    update: (id, venta, callback) => {
        const query = 'UPDATE Ventas SET no_factura = ?, empleado_id = ?, articulo_id = ?, usuario_id = ?, fecha_venta = ?, monto = ?, unidades_vendidas = ?, comentario = ?, estado = ? WHERE id = ?';
        db.run(query, [venta.no_factura, venta.empleado_id, venta.articulo_id, venta.usuario_id, venta.fecha_venta, venta.monto, venta.unidades_vendidas, venta.comentario, venta.estado, id], function (err) {
            callback(err);
        });
    },

    updateUnidadesVendidas: (id, nuevasUnidadesVendidas, callback) => {
        const query = 'UPDATE Ventas SET unidades_vendidas = ? WHERE id = ?';
        db.run(query, [nuevasUnidadesVendidas, id], function (err) {
            callback(err);
        });
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM Ventas WHERE id = ?';
        db.run(query, [id], function (err) {
            callback(err);
        });
    },

    getLastFacturaNumber: (callback) => {
        const query = 'SELECT MAX(no_factura) AS lastFacturaNumber FROM Ventas';
        db.get(query, [], (err, row) => {
            if (err) {
                return callback(err);
            }
            const lastFacturaNumber = row ? row.lastFacturaNumber : 0;
            callback(null, lastFacturaNumber);
        });
    },

    // Función para obtener las ventas asociadas a un artículo
    getVentasByArticuloId: (articuloId, callback) => {
        const query = 'SELECT * FROM Ventas WHERE articulo_id = ?';
        db.all(query, [articuloId], (err, rows) => {
            callback(err, rows);
        });
    }

};

module.exports = VentaModel;
