const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');
const { validaCedula } = require('../utils/validations');

// Mostrar la lista de empleados
exports.listEmpleados = (req, res) => {
    const query = 'SELECT * FROM Empleados';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los empleados');
        } else {
            res.render('empleados/list', { empleados: rows });
        }
    });
};

// Mostrar el formulario para añadir un nuevo empleado
exports.showAddEmpleadoForm = (req, res) => {
    res.render('empleados/add', { errors: {}, formData: {} });
};

// Añadir un nuevo empleado
exports.addEmpleado = (req, res) => {
    const { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state } = req.body;
    const errors = {};
    const formData = { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state };

    // Validaciones adicionales
    if (!/^[A-Za-z\s]+$/.test(nombre)) {
        errors.nombre = 'Nombre inválido, solo se permiten letras y espacios';
    }
    if (!validaCedula(cedula)) {
        errors.cedula = 'Cédula inválida';
    }
    if (porciento_comision <= 0 || isNaN(porciento_comision)) {
        errors.porciento_comision = 'El porciento de comisión debe ser un número positivo';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_ingreso)) {
        errors.fecha_ingreso = 'Fecha de ingreso inválida';
    }

    if (Object.keys(errors).length > 0) {
        res.render('empleados/add', { errors, formData });
    } else {
        const queryCedula = 'SELECT COUNT(*) as count FROM Empleados WHERE cedula = ?';
        db.get(queryCedula, [cedula], (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al verificar la cédula');
            } else if (row.count > 0) {
                errors.cedula = 'La cédula ya está registrada';
                res.render('empleados/add', { errors, formData });
            } else {
                const query = 'INSERT INTO Empleados (nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state) VALUES (?, ?, ?, ?, ?, ?)';
                db.run(query, [nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state], function (err) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al añadir el empleado');
                    } else {
                        res.redirect('/empleados');
                    }
                });
            }
        });
    }
};

// Mostrar el formulario para editar un empleado existente
exports.showEditEmpleadoForm = (req, res) => {
    const queryEmpleado = 'SELECT * FROM Empleados WHERE id = ?';
    db.get(queryEmpleado, [req.params.id], (err, empleado) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el empleado');
        } else if (!empleado) {
            res.status(404).send('Empleado no encontrado');
        } else {
            res.render('empleados/edit', { empleado, errors: {}, formData: empleado });
        }
    });
};

// Editar un empleado existente
exports.editEmpleado = (req, res) => {
    const { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state } = req.body;
    const errors = {};
    const formData = { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state };

    // Validaciones adicionales
    if (!/^[A-Za-z\s]+$/.test(nombre)) {
        errors.nombre = 'Nombre inválido, solo se permiten letras y espacios';
    }
    if (!validaCedula(cedula)) {
        errors.cedula = 'Cédula inválida';
    }
    if (porciento_comision <= 0 || isNaN(porciento_comision)) {
        errors.porciento_comision = 'El porciento de comisión debe ser un número positivo';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_ingreso)) {
        errors.fecha_ingreso = 'Fecha de ingreso inválida';
    }

    if (Object.keys(errors).length > 0) {
        const queryEmpleado = 'SELECT * FROM Empleados WHERE id = ?';
        db.get(queryEmpleado, [req.params.id], (err, empleado) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al obtener el empleado');
            } else {
                res.render('empleados/edit', { empleado, errors, formData });
            }
        });
    } else {
        const queryCedula = 'SELECT COUNT(*) as count FROM Empleados WHERE cedula = ? AND id != ?';
        db.get(queryCedula, [cedula, req.params.id], (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al verificar la cédula');
            } else if (row.count > 0) {
                errors.cedula = 'La cédula ya está registrada para otro empleado';
                const queryEmpleado = 'SELECT * FROM Empleados WHERE id = ?';
                db.get(queryEmpleado, [req.params.id], (err, empleado) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al obtener el empleado');
                    } else {
                        res.render('empleados/edit', { empleado, errors, formData });
                    }
                });
            } else {
                const query = 'UPDATE Empleados SET nombre = ?, cedula = ?, tanda_labor = ?, porciento_comision = ?, fecha_ingreso = ?, state = ? WHERE id = ?';
                db.run(query, [nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state, req.params.id], function (err) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Error al actualizar el empleado');
                    } else {
                        res.redirect('/empleados');
                    }
                });
            }
        });
    }
};

// Eliminar un empleado existente
exports.deleteEmpleado = (req, res) => {
    const query = 'DELETE FROM Empleados WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el empleado');
        } else {
            res.redirect('/empleados');
        }
    });
};

