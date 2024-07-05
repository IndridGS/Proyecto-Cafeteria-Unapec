const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');
const { validarRNC } = require('../utils/validations');

// Mostrar la lista de proveedores
exports.listProveedores = (req, res) => {
    const query = 'SELECT * FROM Proveedores';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los proveedores');
        } else {
            res.render('proveedores/list', { proveedores: rows });
        }
    });
};

// Mostrar el formulario para añadir un nuevo proveedor
exports.showAddProveedorForm = (req, res) => {
    res.render('proveedores/add', { proveedor: {}, rncError: null });
};

// Añadir un nuevo proveedor
exports.addProveedor = (req, res) => {
    const { nombre_comercial, rnc, fecha_registro, state } = req.body;

    // Validar RNC
    if (!validarRNC(rnc)) {
        return res.render('proveedores/add', {
            proveedor: { nombre_comercial, rnc, fecha_registro, state },
            rncError: 'RNC inválido'
        });
    }

    // Verificar si el RNC ya existe
    const checkQuery = 'SELECT * FROM Proveedores WHERE rnc = ?';
    db.get(checkQuery, [rnc], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al verificar el RNC');
        } else if (row) {
            return res.render('proveedores/add', {
                proveedor: { nombre_comercial, rnc, fecha_registro, state },
                rncError: 'El RNC ya existe'
            });
        } else {
            const query = 'INSERT INTO Proveedores (nombre_comercial, rnc, fecha_registro, state) VALUES (?, ?, ?, ?)';
            db.run(query, [nombre_comercial, rnc, fecha_registro, state], function (err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al añadir el proveedor');
                } else {
                    res.redirect('/proveedores');
                }
            });
        }
    });
};

// Mostrar el formulario para editar un proveedor existente
exports.showEditProveedorForm = (req, res) => {
    const query = 'SELECT * FROM Proveedores WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el proveedor');
        } else if (!row) {
            res.status(404).send('Proveedor no encontrado');
        } else {
            res.render('proveedores/edit', { proveedor: row, rncError: null });
        }
    });
};

// Editar un proveedor existente
exports.editProveedor = (req, res) => {
    const { nombre_comercial, rnc, fecha_registro, state } = req.body;

    // Validar RNC
    if (!validarRNC(rnc)) {
        return res.render('proveedores/edit', {
            proveedor: { id: req.params.id, nombre_comercial, rnc, fecha_registro, state },
            rncError: 'RNC inválido'
        });
    }

    // Verificar si el RNC ya existe en otro proveedor
    const checkQuery = 'SELECT * FROM Proveedores WHERE rnc = ? AND id != ?';
    db.get(checkQuery, [rnc, req.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al verificar el RNC');
        } else if (row) {
            return res.render('proveedores/edit', {
                proveedor: { id: req.params.id, nombre_comercial, rnc, fecha_registro, state },
                rncError: 'El RNC ya existe en otro proveedor'
            });
        } else {
            const query = 'UPDATE Proveedores SET nombre_comercial = ?, rnc = ?, fecha_registro = ?, state = ? WHERE id = ?';
            db.run(query, [nombre_comercial, rnc, fecha_registro, state, req.params.id], function (err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al actualizar el proveedor');
                } else {
                    res.redirect('/proveedores');
                }
            });
        }
    });
};

// Eliminar un proveedor existente
exports.deleteProveedor = (req, res) => {
    const query = 'DELETE FROM Proveedores WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el proveedor');
        } else {
            res.redirect('/proveedores');
        }
    });
};
