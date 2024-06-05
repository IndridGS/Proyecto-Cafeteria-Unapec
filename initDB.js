const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/cafeteria.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Campus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        state TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Cafeteria (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        campus_id INTEGER NOT NULL,
        encargado TEXT NOT NULL,
        state TEXT NOT NULL,
        FOREIGN KEY (campus_id) REFERENCES Campus(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS TiposUsuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        state TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Marcas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        state TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Proveedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_comercial TEXT NOT NULL,
        rnc TEXT NOT NULL,
        fecha_registro TEXT NOT NULL,
        state TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        cedula TEXT NOT NULL,
        tipo_usuario_id INTEGER NOT NULL,
        limite_credito REAL NOT NULL,
        fecha_registro TEXT NOT NULL,
        state TEXT NOT NULL,
        FOREIGN KEY (tipo_usuario_id) REFERENCES TiposUsuarios(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Empleados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        cedula TEXT NOT NULL,
        tanda_labor TEXT NOT NULL,
        porciento_comision REAL NOT NULL,
        fecha_ingreso TEXT NOT NULL,
        state TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Articulos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        marca_id INTEGER NOT NULL,
        costo REAL NOT NULL,
        proveedor_id INTEGER NOT NULL,
        existencia INTEGER NOT NULL,
        state TEXT NOT NULL,
        FOREIGN KEY (marca_id) REFERENCES Marcas(id),
        FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id)
    )`);
});

db.close();
console.log('Base de datos inicializada.');




