const EmpleadoModel = require('../models/empleadoModel');

// Mostrar la lista de empleados
exports.listEmpleados = (req, res) => {
    EmpleadoModel.getAll((err, empleados) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los empleados');
        } else {
            res.render('empleados/list', { empleados });
        }
    });
};

// Mostrar el formulario para añadir un nuevo empleado
exports.showAddEmpleadoForm = (req, res) => {
    res.render('empleados/add');
};

// Añadir un nuevo empleado
exports.addEmpleado = (req, res) => {
    const { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state } = req.body;
    EmpleadoModel.create({ nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state }, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al añadir el empleado');
        } else {
            res.redirect('/empleados');
        }
    });
};

// Mostrar el formulario para editar un empleado existente
exports.showEditEmpleadoForm = (req, res) => {
    EmpleadoModel.getById(req.params.id, (err, empleado) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el empleado');
        } else if (!empleado) {
            res.status(404).send('Empleado no encontrado');
        } else {
            res.render('empleados/edit', { empleado });
        }
    });
};

// Editar un empleado existente
exports.editEmpleado = (req, res) => {
    const { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state } = req.body;
    EmpleadoModel.update(req.params.id, { nombre, cedula, tanda_labor, porciento_comision, fecha_ingreso, state }, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar el empleado');
        } else {
            res.redirect('/empleados');
        }
    });
};

// Eliminar un empleado existente
exports.deleteEmpleado = (req, res) => {
    EmpleadoModel.delete(req.params.id, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el empleado');
        } else {
            res.redirect('/empleados');
        }
    });
};
