const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menuController');
const campusController = require('../controllers/campusController');
const cafeteriaController = require('../controllers/cafeteriaController');
const tiposUsuarioController = require('../controllers/tiposUsuarioController');
const proveedorController = require('../controllers/proveedorController');
const marcaController = require('../controllers/marcaController');
const usuarioController = require('../controllers/usuarioController');
const empleadoController = require('../controllers/empleadoController');
const articuloController = require('../controllers/articuloController'); // Añadir el controlador de artículos

// Ruta de la página de inicio
router.get('/', menuController.renderHomePage);

// Rutas para la gestión de campus
router.get('/campus', campusController.listCampuses);
router.get('/campus/add', campusController.showAddCampusForm);
router.post('/campus/add', campusController.addCampus);
router.get('/campus/edit/:id', campusController.showEditCampusForm);
router.post('/campus/edit/:id', campusController.editCampus);
router.get('/campus/delete/:id', campusController.deleteCampus);

// Rutas para la gestión de cafeterías
router.get('/cafeterias', cafeteriaController.listCafeterias);
router.get('/cafeterias/add', cafeteriaController.showAddCafeteriaForm);
router.post('/cafeterias/add', cafeteriaController.addCafeteria);
router.get('/cafeterias/edit/:id', cafeteriaController.showEditCafeteriaForm);
router.post('/cafeterias/edit/:id', cafeteriaController.editCafeteria);
router.get('/cafeterias/delete/:id', cafeteriaController.deleteCafeteria);

// Rutas para la gestión de tipos de usuarios
router.get('/tipos-usuarios', tiposUsuarioController.listTiposUsuarios);
router.get('/tipos-usuarios/add', tiposUsuarioController.showAddTipoUsuarioForm);
router.post('/tipos-usuarios/add', tiposUsuarioController.addTipoUsuario);
router.get('/tipos-usuarios/edit/:id', tiposUsuarioController.showEditTipoUsuarioForm);
router.post('/tipos-usuarios/edit/:id', tiposUsuarioController.editTipoUsuario);
router.get('/tipos-usuarios/delete/:id', tiposUsuarioController.deleteTipoUsuario);

// Rutas para la gestión de proveedores
router.get('/proveedores', proveedorController.listProveedores);
router.get('/proveedores/add', proveedorController.showAddProveedorForm);
router.post('/proveedores/add', proveedorController.addProveedor);
router.get('/proveedores/edit/:id', proveedorController.showEditProveedorForm);
router.post('/proveedores/edit/:id', proveedorController.editProveedor);
router.get('/proveedores/delete/:id', proveedorController.deleteProveedor);

// Rutas para la gestión de marcas
router.get('/marcas', marcaController.listMarcas);
router.get('/marcas/add', marcaController.showAddMarcaForm);
router.post('/marcas/add', marcaController.addMarca);
router.get('/marcas/edit/:id', marcaController.showEditMarcaForm);
router.post('/marcas/edit/:id', marcaController.editMarca);
router.get('/marcas/delete/:id', marcaController.deleteMarca);

// Rutas para la gestión de usuarios
router.get('/usuarios', usuarioController.listUsuarios);
router.get('/usuarios/add', usuarioController.showAddUsuarioForm);
router.post('/usuarios/add', usuarioController.addUsuario);
router.get('/usuarios/edit/:id', usuarioController.showEditUsuarioForm);
router.post('/usuarios/edit/:id', usuarioController.editUsuario);
router.get('/usuarios/delete/:id', usuarioController.deleteUsuario);

// Rutas para la gestión de empleados
router.get('/empleados', empleadoController.listEmpleados);
router.get('/empleados/add', empleadoController.showAddEmpleadoForm);
router.post('/empleados/add', empleadoController.addEmpleado);
router.get('/empleados/edit/:id', empleadoController.showEditEmpleadoForm);
router.post('/empleados/edit/:id', empleadoController.editEmpleado);
router.get('/empleados/delete/:id', empleadoController.deleteEmpleado);

// Rutas para la gestión de artículos
router.get('/articulos', articuloController.listArticulos);
router.get('/articulos/add', articuloController.showAddArticuloForm);
router.post('/articulos/add', articuloController.addArticulo);
router.get('/articulos/edit/:id', articuloController.showEditArticuloForm);
router.post('/articulos/edit/:id', articuloController.editArticulo);
router.get('/articulos/delete/:id', articuloController.deleteArticulo);

module.exports = router;


