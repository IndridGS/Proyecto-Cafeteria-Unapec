const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');
const TipoUsuarioModel = require('../models/tipoUsuarioModel');
const { validaCedula } = require('../utils/validations');

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

    const errors = {};
    const formData = { nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state };

    // Validaciones adicionales
    if (!/^[A-Za-z\s]+$/.test(nombre)) {
        errors.nombre = 'Nombre inválido, solo se permiten letras y espacios';
    }
    if (!validaCedula(cedula)) {
        errors.cedula = 'Cédula inválida';
    }
    if (limite_credito < 0) {
        errors.limite_credito = 'Límite de crédito debe ser un número positivo';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_registro)) {
        errors.fecha_registro = 'Fecha de registro inválida';
    }

    if (Object.keys(errors).length > 0) {
        TipoUsuarioModel.getAll((err, tiposUsuarios) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al obtener los tipos de usuarios');
            } else {
                res.render('usuarios/add', { tiposUsuarios, errors, formData });
            }
        });
    } else {
        const queryCedula = 'SELECT COUNT(*) as count FROM Usuarios WHERE cedula = ?';
        db.get(queryCedula, [cedula], (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al verificar la cédula');
            } else if (row.count > 0) {
                errors.cedula = 'La cédula ya está registrada';
                TipoUsuarioModel.getAll((err, tiposUsuarios) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al obtener los tipos de usuarios');
                    } else {
                        res.render('usuarios/add', { tiposUsuarios, errors, formData });
                    }
                });
            } else {
                const query = 'INSERT INTO Usuarios (nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state) VALUES (?, ?, ?, ?, ?, ?)';
                db.run(query, [nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state], function (err) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al añadir el usuario');
                    } else {
                        res.redirect('/usuarios');
                    }
                });
            }
        });
    }
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

    const errors = {};
    const formData = { nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state };

    // Validaciones adicionales
    if (!/^[A-Za-z\s]+$/.test(nombre)) {
        errors.nombre = 'Nombre inválido, solo se permiten letras y espacios';
    }
    if (!validaCedula(cedula)) {
        errors.cedula = 'Cédula inválida';
    }
    if (limite_credito < 0) {
        errors.limite_credito = 'Límite de crédito debe ser un número positivo';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_registro)) {
        errors.fecha_registro = 'Fecha de registro inválida';
    }

    if (Object.keys(errors).length > 0) {
        TipoUsuarioModel.getAll((err, tiposUsuarios) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al obtener los tipos de usuarios');
            } else {
                const queryUsuario = 'SELECT * FROM Usuarios WHERE id = ?';
                db.get(queryUsuario, [req.params.id], (err, usuario) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al obtener el usuario');
                    } else {
                        res.render('usuarios/edit', { usuario, tiposUsuarios, errors, formData });
                    }
                });
            }
        });
    } else {
        const queryCedula = 'SELECT COUNT(*) as count FROM Usuarios WHERE cedula = ? AND id != ?';
        db.get(queryCedula, [cedula, req.params.id], (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al verificar la cédula');
            } else if (row.count > 0) {
                errors.cedula = 'La cédula ya está registrada para otro usuario';
                TipoUsuarioModel.getAll((err, tiposUsuarios) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al obtener los tipos de usuarios');
                    } else {
                        const queryUsuario = 'SELECT * FROM Usuarios WHERE id = ?';
                        db.get(queryUsuario, [req.params.id], (err, usuario) => {
                            if (err) {
                                console.error(err.message);
                                res.status(500).send('Error al obtener el usuario');
                            } else {
                                res.render('usuarios/edit', { usuario, tiposUsuarios, errors, formData });
                            }
                        });
                    }
                });
            } else {
                const query = 'UPDATE Usuarios SET nombre = ?, cedula = ?, tipo_usuario_id = ?, limite_credito = ?, fecha_registro = ?, state = ? WHERE id = ?';
                db.run(query, [nombre, cedula, tipo_usuario_id, limite_credito, fecha_registro, state, req.params.id], function (err) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al actualizar el usuario');
                    } else {
                        res.redirect('/usuarios');
                    }
                });
            }
        });
    }
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
