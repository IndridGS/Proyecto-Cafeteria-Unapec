const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

exports.consultarVentas = (req, res) => {
    let { usuario, fecha_inicio, fecha_fin } = req.query;
    let query = `
        SELECT v.id AS factura, u.nombre AS usuario, v.fecha_venta, v.monto, v.comentario, v.estado
        FROM ventas v
        JOIN usuarios u ON v.usuario_id = u.id
        WHERE 1=1
    `;
    let params = [];

    if (usuario) {
        query += " AND u.nombre LIKE ?";
        params.push('%' + usuario + '%');
    }
    if (fecha_inicio) {
        query += " AND v.fecha_venta >= ?";
        params.push(fecha_inicio);
    }
    if (fecha_fin) {
        query += " AND v.fecha_venta <= ?";
        params.push(fecha_fin);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener las ventas');
        } else {
            res.render('consultas/consultaVentas', { ventas: rows });
        }
    });
};
