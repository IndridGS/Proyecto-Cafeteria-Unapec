// controllers/tiposUsuarioController.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

// Mostrar la lista de tipos de usuarios
exports.listTiposUsuarios = (req, res) => {
    const query = 'SELECT * FROM TiposUsuarios';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los tipos de usuarios');
        } else {
            res.render('tiposUsuarios/list', { tiposUsuarios: rows });
        }
    });
};

// Mostrar el formulario para añadir un nuevo tipo de usuario
exports.showAddTipoUsuarioForm = (req, res) => {
    res.render('tiposUsuarios/add');
};

// Añadir un nuevo tipo de usuario
exports.addTipoUsuario = (req, res) => {
    const { description, state } = req.body;
    const query = 'INSERT INTO TiposUsuarios (description, state) VALUES (?, ?)';
    db.run(query, [description, state], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al añadir el tipo de usuario');
        } else {
            res.redirect('/tipos-usuarios');
        }
    });
};

// Mostrar el formulario para editar un tipo de usuario existente
exports.showEditTipoUsuarioForm = (req, res) => {
    const query = 'SELECT * FROM TiposUsuarios WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el tipo de usuario');
        } else if (!row) {
            res.status(404).send('Tipo de usuario no encontrado');
        } else {
            res.render('tiposUsuarios/edit', { tipoUsuario: row });
        }
    });
};

// Editar un tipo de usuario existente
exports.editTipoUsuario = (req, res) => {
    const { description, state } = req.body;
    const query = 'UPDATE TiposUsuarios SET description = ?, state = ? WHERE id = ?';
    db.run(query, [description, state, req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar el tipo de usuario');
        } else {
            res.redirect('/tipos-usuarios');
        }
    });
};

// Eliminar un tipo de usuario existente
exports.deleteTipoUsuario = (req, res) => {
    const query = 'DELETE FROM TiposUsuarios WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el tipo de usuario');
        } else {
            res.redirect('/tipos-usuarios');
        }
    });
};
