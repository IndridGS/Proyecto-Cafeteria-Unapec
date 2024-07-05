const express = require('express');
const router = express.Router();

const ventasController = require('../controllers/ventasController');
const menuController = require('../controllers/menuController');
const campusController = require('../controllers/campusController');
const cafeteriaController = require('../controllers/cafeteriaController');
const tiposUsuarioController = require('../controllers/tiposUsuarioController');
const proveedorController = require('../controllers/proveedorController');
const marcaController = require('../controllers/marcaController');
const usuarioController = require('../controllers/usuarioController');
const empleadoController = require('../controllers/empleadoController');
const articuloController = require('../controllers/articuloController');
const consultasController = require('../controllers/consultasController');



// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}
// Ruta para mostrar el formulario de consultas
router.get('/consultas', (req, res) => {
    res.render('consultas/consultas');  // Aquí aseguramos de que la vista 'consultas/consultas.ejs' exista
});



// Ruta para realizar la consulta de ventas
router.get('/consultas/ventas', consultasController.consultarVentas);



// Ruta para la búsqueda de ventas
router.get('/consultas/ventas', isAuthenticated, consultasController.consultarVentas);

// Ruta de la página de inicio
router.get('/', menuController.renderHomePage);

// Rutas protegidas
router.get('/ventas', isAuthenticated, ventasController.listVentas);
router.get('/ventas/add', isAuthenticated, ventasController.showAddVentaForm);
router.post('/ventas/add', isAuthenticated, ventasController.addVenta);
router.get('/ventas/edit/:id', isAuthenticated, ventasController.showEditVentaForm);
router.post('/ventas/edit/:id', isAuthenticated, ventasController.editVenta);
router.get('/ventas/delete/:id', isAuthenticated, ventasController.deleteVenta);

// Rutas para la gestión de campus
router.get('/campus', isAuthenticated, campusController.listCampuses);
router.get('/campus/add', isAuthenticated, campusController.showAddCampusForm);
router.post('/campus/add', isAuthenticated, campusController.addCampus);
router.get('/campus/edit/:id', isAuthenticated, campusController.showEditCampusForm);
router.post('/campus/edit/:id', isAuthenticated, campusController.editCampus);
router.get('/campus/delete/:id', isAuthenticated, campusController.deleteCampus);

// Rutas para la gestión de cafeterías
router.get('/cafeterias', isAuthenticated, cafeteriaController.listCafeterias);
router.get('/cafeterias/add', isAuthenticated, cafeteriaController.showAddCafeteriaForm);
router.post('/cafeterias/add', isAuthenticated, cafeteriaController.addCafeteria);
router.get('/cafeterias/edit/:id', isAuthenticated, cafeteriaController.showEditCafeteriaForm);
router.post('/cafeterias/edit/:id', isAuthenticated, cafeteriaController.editCafeteria);
router.get('/cafeterias/delete/:id', isAuthenticated, cafeteriaController.deleteCafeteria);

// Rutas para la gestión de tipos de usuarios
router.get('/tipos-usuarios', isAuthenticated, tiposUsuarioController.listTiposUsuarios);
router.get('/tipos-usuarios/add', isAuthenticated, tiposUsuarioController.showAddTipoUsuarioForm);
router.post('/tipos-usuarios/add', isAuthenticated, tiposUsuarioController.addTipoUsuario);
router.get('/tipos-usuarios/edit/:id', isAuthenticated, tiposUsuarioController.showEditTipoUsuarioForm);
router.post('/tipos-usuarios/edit/:id', isAuthenticated, tiposUsuarioController.editTipoUsuario);
router.get('/tipos-usuarios/delete/:id', isAuthenticated, tiposUsuarioController.deleteTipoUsuario);

// Rutas para la gestión de proveedores
router.get('/proveedores', isAuthenticated, proveedorController.listProveedores);
router.get('/proveedores/add', isAuthenticated, proveedorController.showAddProveedorForm);
router.post('/proveedores/add', isAuthenticated, proveedorController.addProveedor);
router.get('/proveedores/edit/:id', isAuthenticated, proveedorController.showEditProveedorForm);
router.post('/proveedores/edit/:id', isAuthenticated, proveedorController.editProveedor);
router.get('/proveedores/delete/:id', isAuthenticated, proveedorController.deleteProveedor);

// Rutas para la gestión de marcas
router.get('/marcas', isAuthenticated, marcaController.listMarcas);
router.get('/marcas/add', isAuthenticated, marcaController.showAddMarcaForm);
router.post('/marcas/add', isAuthenticated, marcaController.addMarca);
router.get('/marcas/edit/:id', isAuthenticated, marcaController.showEditMarcaForm);
router.post('/marcas/edit/:id', isAuthenticated, marcaController.editMarca);
router.get('/marcas/delete/:id', isAuthenticated, marcaController.deleteMarca);

// Rutas para la gestión de usuarios
router.get('/usuarios', isAuthenticated, usuarioController.listUsuarios);
router.get('/usuarios/add', isAuthenticated, usuarioController.showAddUsuarioForm);
router.post('/usuarios/add', isAuthenticated, usuarioController.addUsuario);
router.get('/usuarios/edit/:id', isAuthenticated, usuarioController.showEditUsuarioForm);
router.post('/usuarios/edit/:id', isAuthenticated, usuarioController.editUsuario);
router.get('/usuarios/delete/:id', isAuthenticated, usuarioController.deleteUsuario);

// Rutas para la gestión de empleados
router.get('/empleados', isAuthenticated, empleadoController.listEmpleados);
router.get('/empleados/add', isAuthenticated, empleadoController.showAddEmpleadoForm);
router.post('/empleados/add', isAuthenticated, empleadoController.addEmpleado);
router.get('/empleados/edit/:id', isAuthenticated, empleadoController.showEditEmpleadoForm);
router.post('/empleados/edit/:id', isAuthenticated, empleadoController.editEmpleado);
router.get('/empleados/delete/:id', isAuthenticated, empleadoController.deleteEmpleado);

// Rutas para la gestión de artículos
router.get('/articulos', isAuthenticated, articuloController.listArticulos);
router.get('/articulos/add', isAuthenticated, articuloController.showAddArticuloForm);
router.post('/articulos/add', isAuthenticated, articuloController.addArticulo);
router.get('/articulos/edit/:id', isAuthenticated, articuloController.showEditArticuloForm);
router.post('/articulos/edit/:id', isAuthenticated, articuloController.editArticulo);
router.get('/articulos/delete/:id', isAuthenticated, articuloController.deleteArticulo);

module.exports = router;
