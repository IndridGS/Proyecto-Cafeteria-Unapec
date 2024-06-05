// controllers/campusController.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

// Mostrar la lista de campus
exports.listCampuses = (req, res) => {
    const query = 'SELECT * FROM Campus';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los campus');
        } else {
            console.log('Registros encontrados:', rows);
            res.render('campus/list', { campuses: rows });
        }
    });
};

// Mostrar el formulario para añadir un nuevo campus
exports.showAddCampusForm = (req, res) => {
    res.render('campus/add');
};

// Añadir un nuevo campus
exports.addCampus = (req, res) => {
    const { description, state } = req.body;
    const query = 'INSERT INTO Campus (description, state) VALUES (?, ?)';
    db.run(query, [description, state], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al añadir el campus');
        } else {
            res.redirect('/campus');
        }
    });
};

// Mostrar el formulario para editar un campus existente
exports.showEditCampusForm = (req, res) => {
    const query = 'SELECT * FROM Campus WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el campus');
        } else if (!row) {
            res.status(404).send('Campus no encontrado');
        } else {
            res.render('campus/edit', { campus: row });
        }
    });
};

// Editar un campus existente
exports.editCampus = (req, res) => {
    const { description, state } = req.body;
    const query = 'UPDATE Campus SET description = ?, state = ? WHERE id = ?';
    db.run(query, [description, state, req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar el campus');
        } else {
            res.redirect('/campus');
        }
    });
};

// Eliminar un campus existente
exports.deleteCampus = (req, res) => {
    const query = 'DELETE FROM Campus WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el campus');
        } else {
            res.redirect('/campus');
        }
    });
};
