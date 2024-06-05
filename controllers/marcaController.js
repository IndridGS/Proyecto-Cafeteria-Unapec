// controllers/marcaController.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

// Mostrar la lista de marcas
exports.listMarcas = (req, res) => {
    const query = 'SELECT * FROM Marcas';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener las marcas');
        } else {
            res.render('marcas/list', { marcas: rows });
        }
    });
};

// Mostrar el formulario para añadir una nueva marca
exports.showAddMarcaForm = (req, res) => {
    res.render('marcas/add');
};

// Añadir una nueva marca
exports.addMarca = (req, res) => {
    const { description, state } = req.body;
    if (!['Activo', 'Inactivo'].includes(state)) {
        res.status(400).send('Estado inválido');
        return;
    }
    const query = 'INSERT INTO Marcas (description, state) VALUES (?, ?)';
    db.run(query, [description, state], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al añadir la marca');
        } else {
            res.redirect('/marcas');
        }
    });
};

// Mostrar el formulario para editar una marca existente
exports.showEditMarcaForm = (req, res) => {
    const query = 'SELECT * FROM Marcas WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener la marca');
        } else if (!row) {
            res.status(404).send('Marca no encontrada');
        } else {
            res.render('marcas/edit', { marca: row });
        }
    });
};

// Editar una marca existente
exports.editMarca = (req, res) => {
    const { description, state } = req.body;
    if (!['Activo', 'Inactivo'].includes(state)) {
        res.status(400).send('Estado inválido');
        return;
    }
    const query = 'UPDATE Marcas SET description = ?, state = ? WHERE id = ?';
    db.run(query, [description, state, req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar la marca');
        } else {
            res.redirect('/marcas');
        }
    });
};

// Eliminar una marca existente
exports.deleteMarca = (req, res) => {
    const query = 'DELETE FROM Marcas WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar la marca');
        } else {
            res.redirect('/marcas');
        }
    });
};
