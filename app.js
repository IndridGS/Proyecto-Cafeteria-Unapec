const express = require('express');
const path = require('path');

const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: false }));

// Importar rutas
const indexRouter = require('./routes/index');

// Usar rutas
app.use('/', indexRouter);

// Configuración del puerto y lanzamiento del servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
