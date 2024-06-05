// controllers/articuloController.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

exports.listArticulos = (req, res) => {
    const query = 'SELECT * FROM Articulos';
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
                        proveedores: proveedores
                    });
                }
            });
        }
    });
};

exports.addArticulo = (req, res) => {
    const { description, marca_id, costo, proveedor_id, existencia, state } = req.body;
    const query = 'INSERT INTO Articulos (description, marca_id, costo, proveedor_id, existencia, state) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(query, [description, marca_id, costo, proveedor_id, existencia, state], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al añadir el artículo');
        } else {
            res.redirect('/articulos');
        }
    });
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
                                proveedores: proveedores
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
            console.error(err.message);
            res.status(500).send('Error al eliminar el artículo');
        } else {
            res.redirect('/articulos');
        }
    });
};
