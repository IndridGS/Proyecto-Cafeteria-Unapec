const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

// Mostrar la lista de cafeterías
exports.listCafeterias = (req, res) => {
    const query = `
        SELECT Cafeteria.id, Cafeteria.description, Campus.description AS campus, Cafeteria.encargado, Cafeteria.state
        FROM Cafeteria
        JOIN Campus ON Cafeteria.campus_id = Campus.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener las cafeterías');
        } else {
            res.render('cafeterias/list', { cafeterias: rows });
        }
    });
};

// Mostrar el formulario para añadir una nueva cafetería
exports.showAddCafeteriaForm = (req, res) => {
    const query = 'SELECT * FROM Campus WHERE state = "Activo"';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los campus');
        } else {
            res.render('cafeterias/add', { campuses: rows });
        }
    });
};

// Añadir una nueva cafetería
exports.addCafeteria = (req, res) => {
    const { description, campus_id, encargado, state } = req.body;
    const query = 'INSERT INTO Cafeteria (description, campus_id, encargado, state) VALUES (?, ?, ?, ?)';
    db.run(query, [description, campus_id, encargado, state], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al añadir la cafetería');
        } else {
            res.redirect('/cafeterias');
        }
    });
};

// Mostrar el formulario para editar una cafetería existente
exports.showEditCafeteriaForm = (req, res) => {
    const queryCafeteria = 'SELECT * FROM Cafeteria WHERE id = ?';
    const queryCampus = 'SELECT * FROM Campus WHERE state = "Activo"';
    db.get(queryCafeteria, [req.params.id], (err, cafeteria) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener la cafetería');
        } else if (!cafeteria) {
            res.status(404).send('Cafetería no encontrada');
        } else {
            db.all(queryCampus, [], (err, campuses) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al obtener los campus');
                } else {
                    res.render('cafeterias/edit', { cafeteria, campuses });
                }
            });
        }
    });
};

// Editar una cafetería existente
exports.editCafeteria = (req, res) => {
    const { description, campus_id, encargado, state } = req.body;
    const query = 'UPDATE Cafeteria SET description = ?, campus_id = ?, encargado = ?, state = ? WHERE id = ?';
    db.run(query, [description, campus_id, encargado, state, req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar la cafetería');
        } else {
            res.redirect('/cafeterias');
        }
    });
};

// Eliminar una cafetería existente
exports.deleteCafeteria = (req, res) => {
    const query = 'DELETE FROM Cafeteria WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar la cafetería');
        } else {
            res.redirect('/cafeterias');
        }
    });
};
