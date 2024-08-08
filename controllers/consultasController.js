
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


const reportsDir = path.join(__dirname, '..', 'public', 'reports');

// Crear el directorio si no existe
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

exports.consultar = (req, res) => {
    res.render('consultas/consultas', {
        datos: [],
        tipo: '',
        usuario: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: '',
        total: 0
    });
};

exports.consultarDatos = (req, res) => {
    const { tipo, usuario, fecha_inicio, fecha_fin, monto_minimo, monto_maximo, estado } = req.query;
    let query = '';
    let params = [];

    if (tipo === 'ventas') {
        query = `
            SELECT v.id AS factura, e.nombre AS empleado, a.description AS articulo, u.nombre AS usuario, 
                   v.fecha_venta, v.monto, v.unidades_vendidas, v.comentario, v.estado
            FROM ventas v
            JOIN usuarios u ON v.usuario_id = u.id
            JOIN empleados e ON v.empleado_id = e.id
            JOIN articulos a ON v.articulo_id = a.id
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND u.nombre LIKE ?";
            params.push('%' + usuario + '%');
        }
        if (fecha_inicio) {
            query += " AND v.fecha_venta >= ?";
            params.push(fecha_inicio);
        }
        if (fecha_fin) {
            query += " AND v.fecha_venta <= ?";
            params.push(fecha_fin);
        }
        if (monto_minimo) {
            query += " AND v.monto >= ?";
            params.push(monto_minimo);
        }
        if (monto_maximo) {
            query += " AND v.monto <= ?";
            params.push(monto_maximo);
        }
        if (estado) {
            query += " AND v.estado = ?";
            params.push(estado);
        }
    } else if (tipo === 'articulos') {
        query = `
            SELECT a.id, a.description, a.costo, a.existencia, a.state
            FROM articulos a
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND a.description LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'usuarios') {
        query = `
            SELECT u.id, u.nombre, u.cedula, tu.description AS tipo_usuario, u.limite_credito, u.fecha_registro, u.state AS estado
            FROM usuarios u
            JOIN TiposUsuarios tu ON u.tipo_usuario_id = tu.id
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND u.nombre LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'empleados') {
        query = `
            SELECT e.id, e.nombre, e.cedula, e.tanda_labor, e.porciento_comision, e.fecha_ingreso, e.state AS estado
            FROM empleados e
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND e.nombre LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'proveedores') {
        query = `
            SELECT p.id, p.nombre_comercial, p.rnc, p.fecha_registro, p.state AS estado
            FROM proveedores p
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND p.nombre_comercial LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'cafeterias') {
        query = `
            SELECT c.id, c.description AS descripcion, c.campus_id, c.encargado, c.state AS estado
            FROM Cafeteria c
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND c.description LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'marcas') {
        query = `
            SELECT m.id, m.description AS descripcion, m.state AS estado
            FROM marcas m
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND m.description LIKE ?";
            params.push('%' + usuario + '%');
        }
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los datos');
        } else {
            let total = 0;
            if (tipo === 'ventas') {
                total = rows.reduce((sum, row) => sum + (row.monto * row.unidades_vendidas), 0);
            }
            res.render('consultas/consultas', {
                datos: rows,
                tipo,
                usuario,
                fecha_inicio,
                fecha_fin,
                estado,
                total
            });
        }
    });
};

exports.generarReporte = (req, res) => {
    const { tipo, usuario, fecha_inicio, fecha_fin, estado } = req.query;
    let query = '';
    let params = [];

    if (tipo === 'ventas') {
        query = `
            SELECT v.id AS factura, e.nombre AS empleado, a.description AS articulo, u.nombre AS usuario, 
                   v.fecha_venta, v.monto, v.unidades_vendidas, v.comentario, v.estado
            FROM ventas v
            JOIN usuarios u ON v.usuario_id = u.id
            JOIN empleados e ON v.empleado_id = e.id
            JOIN articulos a ON v.articulo_id = a.id
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND u.nombre LIKE ?";
            params.push('%' + usuario + '%');
        }
        if (fecha_inicio) {
            query += " AND v.fecha_venta >= ?";
            params.push(fecha_inicio);
        }
        if (fecha_fin) {
            query += " AND v.fecha_venta <= ?";
            params.push(fecha_fin);
        }
        if (estado) {
            query += " AND v.estado = ?";
            params.push(estado);
        }
    } else if (tipo === 'articulos') {
        query = `
            SELECT a.id, a.description, a.costo, a.existencia, a.state
            FROM articulos a
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND a.description LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'usuarios') {
        query = `
            SELECT u.id, u.nombre, u.cedula, tu.description AS tipo_usuario, u.limite_credito, u.fecha_registro, u.state AS estado
            FROM usuarios u
            JOIN TiposUsuarios tu ON u.tipo_usuario_id = tu.id
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND u.nombre LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'empleados') {
        query = `
            SELECT e.id, e.nombre, e.cedula, e.tanda_labor, e.porciento_comision, e.fecha_ingreso, e.state AS estado
            FROM empleados e
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND e.nombre LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'proveedores') {
        query = `
            SELECT p.id, p.nombre_comercial, p.rnc, p.fecha_registro, p.state AS estado
            FROM proveedores p
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND p.nombre_comercial LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'cafeterias') {
        query = `
            SELECT c.id, c.description AS descripcion, c.campus_id, c.encargado, c.state AS estado
            FROM Cafeteria c
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND c.description LIKE ?";
            params.push('%' + usuario + '%');
        }
    } else if (tipo === 'marcas') {
        query = `
            SELECT m.id, m.description AS descripcion, m.state AS estado
            FROM marcas m
            WHERE 1=1
        `;
        if (usuario) {
            query += " AND m.description LIKE ?";
            params.push('%' + usuario + '%');
        }
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener los datos');
        } else {
            const doc = new PDFDocument({ margins: { top: 50, bottom: 50, left: 50, right: 50 } });
            const filePath = path.join(reportsDir, `reporte_${tipo}.pdf`);
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Encabezado
            doc.fontSize(20).text(`Reporte de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.text(`Período del Reporte: ${fecha_inicio || 'N/A'} - ${fecha_fin || 'N/A'}`, { align: 'right' });

            doc.moveDown();
            doc.moveDown(); // Asegurarse de que hay suficiente espacio

            // Resumen Ejecutivo
            doc.fontSize(14).text('Resumen Ejecutivo', { align: 'left' });
            doc.moveDown();
            doc.fontSize(12).text(`Este reporte muestra el estado general de ${tipo} durante el período seleccionado.`, { align: 'left' });

            doc.moveDown();
            doc.moveDown(); // Asegurarse de que hay suficiente espacio

            // Calcular el ancho de las columnas dinámicamente
            const columnWidths = calculateColumnWidths(rows, tipo);
            const tableTop = doc.y;
            const itemIncrement = 20;
            let y = tableTop;

            // Column Headers y Datos
           
let columns = [];
if (tipo === 'ventas') {
    columns = [
        { header: 'Fact', key: 'factura' },
        { header: 'Fecha', key: 'fecha_venta' },
        { header: 'Cli', key: 'usuario' },
        { header: 'Emp', key: 'empleado' },
        { header: 'Art', key: 'articulo' },
        { header: 'Cant', key: 'unidades_vendidas' },
        { header: 'P.Unit', key: 'monto' },
        { header: 'P.Tot', key: 'monto_total' },
        { header: 'Est', key: 'estado' },
        { header: 'Com', key: 'comentario' }
    ];
} else if (tipo === 'articulos') {
    columns = [
        { header: 'ID', key: 'id' },
        { header: 'Desc', key: 'description' },
        { header: 'Cost', key: 'costo' },
        { header: 'Exist', key: 'existencia' },
        { header: 'Est', key: 'state' }
    ];
} else if (tipo === 'usuarios') {
    columns = [
        { header: 'ID', key: 'id' },
        { header: 'Nom', key: 'nombre' },
        { header: 'Céd', key: 'cedula' },
        { header: 'T.U.', key: 'tipo_usuario' },
        { header: 'Lím', key: 'limite_credito' },
        { header: 'F.Reg', key: 'fecha_registro' },
        { header: 'Est', key: 'estado' }
    ];
} else if (tipo === 'empleados') {
    columns = [
        { header: 'ID', key: 'id' },
        { header: 'Nom', key: 'nombre' },
        { header: 'Céd', key: 'cedula' },
        { header: 'T.L.', key: 'tanda_labor' },
        { header: 'P.Com', key: 'porciento_comision' },
        { header: 'F.Ing', key: 'fecha_ingreso' },
        { header: 'Est', key: 'estado' }
    ];
} else if (tipo === 'proveedores') {
    columns = [
        { header: 'ID', key: 'id' },
        { header: 'N.C.', key: 'nombre_comercial' },
        { header: 'RNC', key: 'rnc' },
        { header: 'F.Reg', key: 'fecha_registro' },
        { header: 'Est', key: 'estado' }
    ];
} else if (tipo === 'cafeterias') {
    columns = [
        { header: 'ID', key: 'id' },
        { header: 'Desc', key: 'descripcion' },
        { header: 'Camp', key: 'campus_id' },
        { header: 'Enc', key: 'encargado' },
        { header: 'Est', key: 'estado' }
    ];
} else if (tipo === 'marcas') {
    columns = [
        { header: 'ID', key: 'id' },
        { header: 'Desc', key: 'descripcion' },
        { header: 'Est', key: 'estado' }
    ];
}



            // if (tipo === 'ventas') {
            //     columns = [
            //         { header: 'Factura', key: 'factura' },
            //         { header: 'Fecha de Venta', key: 'fecha_venta' },
            //         { header: 'Cliente', key: 'usuario' },
            //         { header: 'Empleado', key: 'empleado' },
            //         { header: 'Artículo', key: 'articulo' },
            //         { header: 'Cantidad', key: 'unidades_vendidas' },
            //         { header: 'Precio Unitario', key: 'monto' },
            //         { header: 'Monto Total', key: 'monto_total' },
            //         { header: 'Estado', key: 'estado' },
            //         { header: 'Comentario', key: 'comentario' }
            //     ];
            // } else if (tipo === 'articulos') {
            //     columns = [
            //         { header: 'ID', key: 'id' },
            //         { header: 'Descripción', key: 'description' },
            //         { header: 'Costo', key: 'costo' },
            //         { header: 'Existencia', key: 'existencia' },
            //         { header: 'Estado', key: 'state' }
            //     ];
            // } else if (tipo === 'usuarios') {
            //     columns = [
            //         { header: 'ID', key: 'id' },
            //         { header: 'Nombre', key: 'nombre' },
            //         { header: 'Cédula', key: 'cedula' },
            //         { header: 'Tipo de Usuario', key: 'tipo_usuario' },
            //         { header: 'Límite de Crédito', key: 'limite_credito' },
            //         { header: 'Fecha de Registro', key: 'fecha_registro' },
            //         { header: 'Estado', key: 'estado' }
            //     ];
            // } else if (tipo === 'empleados') {
            //     columns = [
            //         { header: 'ID', key: 'id' },
            //         { header: 'Nombre', key: 'nombre' },
            //         { header: 'Cédula', key: 'cedula' },
            //         { header: 'Tanda Labor', key: 'tanda_labor' },
            //         { header: 'Porciento Comisión', key: 'porciento_comision' },
            //         { header: 'Fecha de Ingreso', key: 'fecha_ingreso' },
            //         { header: 'Estado', key: 'estado' }
            //     ];
            // } else if (tipo === 'proveedores') {
            //     columns = [
            //         { header: 'ID', key: 'id' },
            //         { header: 'Nombre Comercial', key: 'nombre_comercial' },
            //         { header: 'RNC', key: 'rnc' },
            //         { header: 'Fecha de Registro', key: 'fecha_registro' },
            //         { header: 'Estado', key: 'estado' }
            //     ];
            // } else if (tipo === 'cafeterias') {
            //     columns = [
            //         { header: 'ID', key: 'id' },
            //         { header: 'Descripción', key: 'descripcion' },
            //         { header: 'Campus', key: 'campus_id' },
            //         { header: 'Encargado', key: 'encargado' },
            //         { header: 'Estado', key: 'estado' }
            //     ];
            // } else if (tipo === 'marcas') {
            //     columns = [
            //         { header: 'ID', key: 'id' },
            //         { header: 'Descripción', key: 'descripcion' },
            //         { header: 'Estado', key: 'estado' }
            //     ];
            // }

            // Imprimir Encabezados de Columnas
            doc.font('Courier-Bold').fontSize(10);
            let currentX = 50; // Inicializando posición X
            columns.forEach((col, index) => {
                doc.text(col.header, currentX, y, { width: columnWidths[index], align: 'center' });
                currentX += columnWidths[index] + 10; // Añadir margen de 10 entre columnas
            });
            y += itemIncrement;

            // Imprimir Datos
            doc.font('Courier').fontSize(10);
            rows.forEach(row => {
                currentX = 50; // Reiniciar posición X para cada fila
                columns.forEach((col, index) => {
                    let text = col.key === 'monto_total' ? (row.unidades_vendidas * row.monto).toFixed(2) : row[col.key];
                    text = text ? text.toString() : '';
                    if (text.length > 20) {
                        text = text.substring(0, 17) + '...';
                    }
                    doc.text(text, currentX, y, { width: columnWidths[index], align: 'center' });
                    currentX += columnWidths[index] + 10; // Añadir margen de 10 entre columnas
                });
                y += itemIncrement;
            });

            // Agregar Análisis del Reporte si es Ventas
            if (tipo === 'ventas') {
                doc.addPage();
                doc.fontSize(14).text('Análisis del Reporte', { align: 'center' });
                doc.moveDown();

                let totalVentas = rows.reduce((sum, row) => sum + (row.unidades_vendidas * row.monto), 0);
                let ventasDiarias = totalVentas / ((new Date(fecha_fin) - new Date(fecha_inicio)) / (1000 * 60 * 60 * 24) + 1);
                let articulosMasVendidos = {};
                let empleadosMasVentas = {};
                let clientesPrincipales = {};

                rows.forEach(row => {
                    articulosMasVendidos[row.articulo] = (articulosMasVendidos[row.articulo] || 0) + row.unidades_vendidas;
                    empleadosMasVentas[row.empleado] = (empleadosMasVentas[row.empleado] || 0) + row.unidades_vendidas;
                    clientesPrincipales[row.usuario] = (clientesPrincipales[row.usuario] || 0) + row.unidades_vendidas;
                });

                doc.fontSize(12).text(`Total de Ventas: ${totalVentas}`, { align: 'left' });
                doc.text(`Promedio de Ventas Diarias: ${ventasDiarias.toFixed(2)}`, { align: 'left' });
                doc.moveDown();
                doc.text('Artículos más Vendidos:', { align: 'left' });
                Object.entries(articulosMasVendidos).sort((a, b) => b[1] - a[1]).forEach(([key, value]) => {
                    doc.text(`${key}: ${value}`, { align: 'left' });
                });
                doc.moveDown();
                doc.text('Empleados con Más Ventas:', { align: 'left' });
                Object.entries(empleadosMasVentas).sort((a, b) => b[1] - a[1]).forEach(([key, value]) => {
                    doc.text(`${key}: ${value}`, { align: 'left' });
                });
                doc.moveDown();
                doc.text('Clientes Principales:', { align: 'left' });
                Object.entries(clientesPrincipales).sort((a, b) => b[1] - a[1]).forEach(([key, value]) => {
                    doc.text(`${key}: ${value}`, { align: 'left' });
                });
            }

            doc.end();
            stream.on('finish', () => {
                res.download(filePath);
            });
        }
    });
};

function calculateColumnWidths(rows, tipo) {
    let columnWidths = [];
    let columns = [];


    if (tipo === 'ventas') {
        columns = ['factura', 'fecha', 'usuario', 'empleado', 'articulo', 'cant', 'p.unit', 'p.total', 'estado', 'coment'];
    } else if (tipo === 'articulos') {
        columns = ['id', 'desc', 'costo', 'exist', 'estado'];
    } else if (tipo === 'usuarios') {
        columns = ['id', 'nombre', 'cedula', 'tipo', 'limite', 'f.registro', 'estado'];
    } else if (tipo === 'empleados') {
        columns = ['id', 'nombre', 'cedula', 'tanda', 'p.comision', 'f.ingreso', 'estado'];
    } else if (tipo === 'proveedores') {
        columns = ['id', 'nombre', 'rnc', 'f.registro', 'estado'];
    } else if (tipo === 'cafeterias') {
        columns = ['id', 'desc', 'campus', 'encargado', 'estado'];
    } else if (tipo === 'marcas') {
        columns = ['id', 'desc', 'estado'];
    }
    
    // if (tipo === 'ventas') {
    //     columns = ['factura', 'fecha_venta', 'usuario', 'empleado', 'articulo', 'unidades_vendidas', 'monto', 'monto_total', 'estado', 'comentario'];
    // } else if (tipo === 'articulos') {
    //     columns = ['id', 'description', 'costo', 'existencia', 'state'];
    // } else if (tipo === 'usuarios') {
    //     columns = ['id', 'nombre', 'cedula', 'tipo_usuario', 'limite_credito', 'fecha_registro', 'estado'];
    // } else if (tipo === 'empleados') {
    //     columns = ['id', 'nombre', 'cedula', 'tanda_labor', 'porciento_comision', 'fecha_ingreso', 'estado'];
    // } else if (tipo === 'proveedores') {
    //     columns = ['id', 'nombre_comercial', 'rnc', 'fecha_registro', 'estado'];
    // } else if (tipo === 'cafeterias') {
    //     columns = ['id', 'descripcion', 'campus_id', 'encargado', 'estado'];
    // } else if (tipo === 'marcas') {
    //     columns = ['id', 'descripcion', 'estado'];
    // }

    // columns.forEach((col, index) => {
    //     let maxWidth = Math.max(...rows.map(row => (row[col] ? row[col].toString().length : 0)), col.length) * 7; // Ajustar el multiplicador para los anchos
    //     columnWidths[index] = maxWidth;
    // });

    columns.forEach((col, index) => {
        let maxWidth = Math.max(...rows.map(row => (row[col] ? row[col].toString().length : 0)), col.length) * 7; // Ajustar el multiplicador para los anchos
        columnWidths[index] = maxWidth;
    });


    return columnWidths;
}

