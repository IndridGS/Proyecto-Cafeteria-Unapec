// CONTROLADOR DE ARTICULOS

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');
const ArticuloModel = require('../models/articuloModel'); // ESTO ES PARA QUE SE PUEDA USAR EL MODELO DE ARTICULOS

exports.listArticulos = (req, res) => {
    const query = `
        SELECT a.id, a.description, m.description AS marca, a.costo, p.nombre_comercial AS proveedor, a.existencia, a.state
        FROM Articulos a
        JOIN Marcas m ON a.marca_id = m.id
        JOIN Proveedores p ON a.proveedor_id = p.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los artículos');
        } else {
            res.render('articulos/list', { articulos: rows });
        }
    });
};

exports.showAddArticuloForm = (req, res) => {
    const marcasQuery = 'SELECT * FROM Marcas WHERE state = "Activo"';
    const proveedoresQuery = 'SELECT * FROM Proveedores WHERE state = "Activo"';

    db.all(marcasQuery, [], (err, marcas) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener las marcas');
        } else {
            db.all(proveedoresQuery, [], (err, proveedores) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al obtener los proveedores');
                } else {
                    res.render('articulos/add', {
                        marcas: marcas,
                        proveedores: proveedores,
                        articulo: {},
                        errors: {}
                    });
                }
            });
        }
    });
};

exports.addArticulo = (req, res) => {
    const { description, marca_id, costo, proveedor_id, existencia, state } = req.body;

    // Validar datos
    let errors = {};
    if (costo <= 0) {
        errors.costo = 'El costo debe ser un número positivo.';
    }
    if (existencia <= 0) {
        errors.existencia = 'La existencia debe ser un número positivo.';
    }

    if (Object.keys(errors).length > 0) {
        // Si hay un error, renderizamos la vista con el mensaje de error y los datos ingresados
        const marcasQuery = 'SELECT * FROM Marcas WHERE state = "Activo"';
        const proveedoresQuery = 'SELECT * FROM Proveedores WHERE state = "Activo"';

        db.all(marcasQuery, [], (err, marcas) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al obtener las marcas');
            } else {
                db.all(proveedoresQuery, [], (err, proveedores) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al obtener los proveedores');
                    } else {
                        res.render('articulos/add', {
                            marcas: marcas,
                            proveedores: proveedores,
                            articulo: req.body,
                            errors: errors
                        });
                    }
                });
            }
        });
    } else {
        // Si no hay errores, continuamos con la creación del artículo
        const query = 'INSERT INTO Articulos (description, marca_id, costo, proveedor_id, existencia, state) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(query, [description, marca_id, costo, proveedor_id, existencia, state], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al añadir el artículo');
            } else {
                res.redirect('/articulos');
            }
        });
    }
};

exports.showEditArticuloForm = (req, res) => {
    const id = req.params.id;
    const articuloQuery = 'SELECT * FROM Articulos WHERE id = ?';
    const marcasQuery = 'SELECT * FROM Marcas WHERE state = "Activo"';
    const proveedoresQuery = 'SELECT * FROM Proveedores WHERE state = "Activo"';

    db.get(articuloQuery, [id], (err, articulo) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el artículo');
        } else {
            db.all(marcasQuery, [], (err, marcas) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al obtener las marcas');
                } else {
                    db.all(proveedoresQuery, [], (err, proveedores) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send('Error al obtener los proveedores');
                        } else {
                            res.render('articulos/edit', {
                                articulo: articulo,
                                marcas: marcas,
                                proveedores: proveedores,
                                errors: {}
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.editArticulo = (req, res) => {
    const { description, marca_id, costo, proveedor_id, existencia, state } = req.body;
    const query = 'UPDATE Articulos SET description = ?, marca_id = ?, costo = ?, proveedor_id = ?, existencia = ?, state = ? WHERE id = ?';
    db.run(query, [description, marca_id, costo, proveedor_id, existencia, state, req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar el artículo');
        } else {
            res.redirect('/articulos');
        }
    });
};
exports.deleteArticulo = (req, res) => {
    const query = 'DELETE FROM Articulos WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            if (err.message.includes("FOREIGN KEY constraint failed")) {
                res.status(400).send('No se puede eliminar el artículo porque está asociado a una venta.');
            } else {
                console.error(err.message);
                res.status(500).send('Error al eliminar el artículo');
            }
        } else {
            res.redirect('/articulos');
        }
    });
};

// Obtener la existencia de un artículo por su ID
exports.getExistenciaArticulo = (req, res) => {
    const articulo_id = req.params.id;
    ArticuloModel.getById(articulo_id, (err, articulo) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error al obtener la existencia del artículo');
        }
        res.json({ existencia: articulo.existencia });
    });
};

