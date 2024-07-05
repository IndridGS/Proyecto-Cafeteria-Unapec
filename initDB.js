const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = new sqlite3.Database('./db/cafeteria.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Conectado a la base de datos.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )`);

    // Crear o actualizar el usuario administrador
    const username = 'admin';
    const password = 'SecurePass123!'; // Nueva contraseña segura y sencilla
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
        } else {
            db.run(`INSERT INTO Users (username, password, role) VALUES (?, ?, ?)
                    ON CONFLICT(username) DO UPDATE SET password=excluded.password, role=excluded.role`, 
                    [username, hash, 'admin'], (err) => {
                if (err) {
                    console.error('Error inserting/updating user:', err);
                } else {
                    console.log('Admin user created/updated successfully');
                }

                // Cerrar la base de datos después de la operación
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Base de datos cerrada.');
                });
            });
        }
    });

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

    db.run(`CREATE TABLE IF NOT EXISTS Ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        no_factura TEXT NOT NULL,
        empleado_id INTEGER NOT NULL,
        articulo_id INTEGER NOT NULL,
        usuario_id INTEGER NOT NULL,
        fecha_venta DATE NOT NULL,
        monto REAL NOT NULL,
        unidades_vendidas INTEGER NOT NULL,
        comentario TEXT,
        estado TEXT NOT NULL,
        FOREIGN KEY (empleado_id) REFERENCES Empleados(id),
        FOREIGN KEY (articulo_id) REFERENCES Articulos(id),
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
    )`);
});
