const VentaModel = require('../models/ventaModel');
const EmpleadoModel = require('../models/empleadoModel');
const ArticuloModel = require('../models/articuloModel');
const UsuarioModel = require('../models/usuarioModel');

// Mostrar la lista de ventas
exports.listVentas = (req, res) => {
    VentaModel.getAll((err, ventas) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener las ventas');
        } else {
            res.render('ventas/list', { ventas });
        }
    });
};

// Mostrar el formulario para añadir una nueva venta
exports.showAddVentaForm = (req, res) => {
    EmpleadoModel.getAll((err, empleados) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los empleados');
        } else {
            ArticuloModel.getAllArticulos((err, articulos) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al obtener los artículos');
                } else {
                    UsuarioModel.getAll((err, usuarios) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send('Error al obtener los usuarios');
                        } else {
                            VentaModel.getLastFacturaNumber((err, lastFacturaNumber) => {
                                if (err) {
                                    console.error(err.message);
                                    res.status(500).send('Error al obtener el último número de factura');
                                } else {
                                    const newFacturaNumber = lastFacturaNumber + 1;
                                    const today = new Date().toISOString().split('T')[0];
                                    res.render('ventas/add', { empleados, articulos, usuarios, newFacturaNumber, today });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

// Añadir una nueva venta
exports.addVenta = (req, res) => {
    const { empleado_id, articulo_id, usuario_id, fecha_venta, monto, unidades_vendidas, comentario, estado } = req.body;

    if (monto <= 0) {
        return res.status(400).send('El monto debe ser un valor positivo mayor que 0');
    }

    const no_factura = req.body.no_factura || 1; // Establecer un valor por defecto en caso de error

    VentaModel.create({ no_factura, empleado_id, articulo_id, usuario_id, fecha_venta, monto, unidades_vendidas, comentario, estado }, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al añadir la venta');
        } else {
            res.redirect('/ventas');
        }
    });
};

// Mostrar el formulario para editar una venta existente
exports.showEditVentaForm = (req, res) => {
    VentaModel.getById(req.params.id, (err, venta) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener la venta');
        } else {
            EmpleadoModel.getAll((err, empleados) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al obtener los empleados');
                } else {
                    ArticuloModel.getAllArticulos((err, articulos) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send('Error al obtener los artículos');
                        } else {
                            UsuarioModel.getAll((err, usuarios) => {
                                if (err) {
                                    console.error(err.message);
                                    res.status(500).send('Error al obtener los usuarios');
                                } else {
                                    res.render('ventas/edit', { venta, empleados, articulos, usuarios });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

// Editar una venta existente
exports.editVenta = (req, res) => {
    const { no_factura, empleado_id, articulo_id, usuario_id, fecha_venta, monto, unidades_vendidas, comentario, estado } = req.body;

    if (monto <= 0) {
        return res.status(400).send('El monto debe ser un valor positivo mayor que 0');
    }

    VentaModel.update(req.params.id, { no_factura, empleado_id, articulo_id, usuario_id, fecha_venta, monto, unidades_vendidas, comentario, estado }, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar la venta');
        } else {
            res.redirect('/ventas');
        }
    });
};

// Eliminar una venta existente
exports.deleteVenta = (req, res) => {
    VentaModel.delete(req.params.id, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar la venta');
        } else {
            res.redirect('/ventas');
        }
    });
};
