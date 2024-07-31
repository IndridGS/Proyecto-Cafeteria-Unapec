
//ventasController.js
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

// Mostrar el formulario para editar una venta existente
exports.showEditVentaForm = (req, res) => {
    VentaModel.getById(req.params.id, (err, venta) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener la venta');
        } else if (!venta) {
            console.error('Venta no encontrada');
            res.status(404).send('Venta no encontrada');
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
                                    // Obtener la existencia del artículo seleccionado
                                    ArticuloModel.getById(venta.articulo_id, (err, articulo) => {
                                        if (err) {
                                            console.error(err.message);
                                            res.status(500).send('Error al obtener el artículo');
                                        } else {
                                            res.render('ventas/edit', { venta, empleados, articulos, usuarios, articuloExistencia: articulo.existencia });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

// Eliminar una venta existente
exports.deleteVenta = (req, res) => {
    const ventaId = req.params.id;
    VentaModel.delete(ventaId, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar la venta');
        } else {
            res.redirect('/ventas');
        }
    });
};


// Nueva función para obtener el precio del artículo
exports.getCostoArticulo = (req, res) => {
    const articulo_id = req.params.id;
    ArticuloModel.getById(articulo_id, (err, articulo) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error al obtener el costo del artículo');
        }
        res.json({ costo: articulo.costo });
    });
};

// Mostrar el formulario para añadir una nueva venta
exports.showAddVentaForm = (req, res) => {
    EmpleadoModel.getAll((err, empleados) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los empleados');
        } else {
            ArticuloModel.getAvailableArticulos((err, articulos) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al obtener los artículos disponibles');
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
                                    res.render('ventas/add', { empleados, articulos, usuarios, newFacturaNumber, today, errorMessage: null });
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

    ArticuloModel.getArticuloById(articulo_id, (err, articulo) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el artículo');
        } else if (!articulo) {
            res.status(404).send('Artículo no encontrado');
        } else if (articulo.existencia < unidades_vendidas) {
            // Aquí pasamos el mensaje de error a la vista
            EmpleadoModel.getAll((err, empleados) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al obtener los empleados');
                } else {
                    ArticuloModel.getAvailableArticulos((err, articulos) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send('Error al obtener los artículos disponibles');
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
                                            res.render('ventas/add', { empleados, articulos, usuarios, newFacturaNumber, today, errorMessage: 'Las unidades vendidas no pueden exceder la existencia del artículo' });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            VentaModel.create({ no_factura, empleado_id, articulo_id, usuario_id, fecha_venta, monto, unidades_vendidas, comentario, estado }, (err, ventaId) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error al añadir la venta');
                } else {
                    // Actualizar la existencia del artículo
                    ArticuloModel.updateExistencia(articulo_id, -unidades_vendidas, (err) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send('Error al actualizar la existencia del artículo');
                        } else {
                            res.redirect('/ventas');
                        }
                    });
                }
            });
        }
    });
};


// Editar una venta existente
exports.editVenta = (req, res) => {
    const { id, no_factura, empleado_id, articulo_id, usuario_id, fecha_venta, monto, unidades_vendidas, comentario, estado } = req.body;

    if (monto <= 0) {
        return res.status(400).send('El monto debe ser un valor positivo mayor que 0');
    }

    VentaModel.getById(id, (err, ventaActual) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error al obtener la venta actual');
        } else if (!ventaActual) {
            console.error('Venta no encontrada');
            return res.status(404).send('Venta no encontrada');
        }

        ArticuloModel.getExistenciaById(articulo_id, (err, existencia) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Error al obtener la existencia del artículo');
            }

            const diferenciaUnidades = unidades_vendidas - ventaActual.unidades_vendidas;
            if (diferenciaUnidades > existencia) {
                return res.status(400).send('Las unidades vendidas no pueden exceder la existencia del artículo');
            }

            VentaModel.update(id, { no_factura, empleado_id, articulo_id, usuario_id, fecha_venta, monto, unidades_vendidas, comentario, estado }, (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Error al actualizar la venta');
                }

                ArticuloModel.updateExistencia(articulo_id, -diferenciaUnidades, (err) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).send('Error al actualizar la existencia del artículo');
                    }
                    res.redirect('/ventas');
                });
            });
        });
    });
};

exports.getVentasByArticuloId = (req, res) => {
    const articuloId = req.params.id;
    VentaModel.getVentasByArticuloId(articuloId, (err, ventas) => {
        if (err) {
            return res.status(500).json({ error: 'Error al verificar las ventas asociadas.' });
        }
        res.json({ ventas });
    });
};
