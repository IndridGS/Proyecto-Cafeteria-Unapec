const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');
const TipoUsuarioModel = require('../models/tipoUsuarioModel');

// Mostrar la lista de usuarios
exports.listUsuarios = (req, res) => {
    const query = `
        SELECT Usuarios.id, Usuarios.nombre, Usuarios.cedula, TiposUsuarios.description AS tipo_usuario, Usuarios.limite_credito, Usuarios.fecha_registro, Usuarios.state
        FROM Usuarios
        JOIN TiposUsuarios ON Usuarios.tipo_usuario_id = TiposUsuarios.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los usuarios');
        } else {
            res.render('usuarios/list', { usuarios: rows });
        }
    });
};

// Mostrar el formulario para añadir un nuevo usuario
exports.showAddUsuarioForm = (req, res) => {
    TipoUsuarioModel.getAll((err, tiposUsuarios) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los tipos de usuarios');
        } else {
            res.render('usuarios/add', { tiposUsuarios });
        }
    });
};

// Añadir un nuevo usuario
exports.addUsuario = (req, res) => {
    const { nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state } = req.body;

    // Validaciones adicionales
    if (!/^[A-Za-z\s]+$/.test(nombre)) {
        return res.status(400).send('Nombre inválido, solo se permiten letras y espacios');
    }
    if (!/^\d{3}-\d{7}-\d{1}$/.test(cedula)) {
        return res.status(400).send('Cédula inválida, debe tener el formato 000-0000000-0');
    }
    if (limite_credito < 0) {
        return res.status(400).send('Límite de crédito debe ser un número positivo');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_registro)) {
        return res.status(400).send('Fecha de registro inválida');
    }

    const query = 'INSERT INTO Usuarios (nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(query, [nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al añadir el usuario');
        } else {
            res.redirect('/usuarios');
        }
    });
};

// Mostrar el formulario para editar un usuario existente
exports.showEditUsuarioForm = (req, res) => {
    const queryUsuario = 'SELECT * FROM Usuarios WHERE id = ?';
    db.get(queryUsuario, [req.params.id], (err, usuario) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el usuario');
        } else if (!usuario) {
            res.status(404).send('Usuario no encontrado');
        } else {
            TipoUsuarioModel.getAll((err, tiposUsuarios) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al obtener los tipos de usuarios');
                } else {
                    res.render('usuarios/edit', { usuario, tiposUsuarios });
                }
            });
        }
    });
};

// Editar un usuario existente
exports.editUsuario = (req, res) => {
    const { nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state } = req.body;

    // Validaciones adicionales
    if (!/^[A-Za-z\s]+$/.test(nombre)) {
        return res.status(400).send('Nombre inválido, solo se permiten letras y espacios');
    }
    if (!/^\d{3}-\d{7}-\d{1}$/.test(cedula)) {
        return res.status(400).send('Cédula inválida, debe tener el formato 000-0000000-0');
    }
    if (limite_credito < 0) {
        return res.status(400).send('Límite de crédito debe ser un número positivo');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_registro)) {
        return res.status(400).send('Fecha de registro inválida');
    }

    const query = 'UPDATE Usuarios SET nombre = ?, cedula = ?, tipo_usuario_id = ?, limite_credito = ?, fecha_registro = ?, state = ? WHERE id = ?';
    db.run(query, [nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state, req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar el usuario');
        } else {
            res.redirect('/usuarios');
        }
    });
};

// Eliminar un usuario existente
exports.deleteUsuario = (req, res) => {
    const query = 'DELETE FROM Usuarios WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el usuario');
        } else {
            res.redirect('/usuarios');
        }
    });
};
