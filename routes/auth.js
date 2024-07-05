const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Conectar a la base de datos
const db = new sqlite3.Database('./db/cafeteria.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Conectado a la base de datos desde auth.js');
});

// Ruta de login
router.get('/login', (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render('login', { error: error }); // Pasar el mensaje de error a la vista
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        req.session.error = 'Username and password are required';
        return res.redirect('/auth/login');
    }

    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Error querying the database:', err);
            req.session.error = 'Internal server error';
            return res.redirect('/auth/login');
        }
        if (!user) {
            req.session.error = 'Invalid username or password';
            return res.redirect('/auth/login');
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                req.session.error = 'Internal server error';
                return res.redirect('/auth/login');
            }
            if (!result) {
                req.session.error = 'Invalid username or password';
                return res.redirect('/auth/login');
            }

                        // Establecer la sesión del usuario
                        req.session.user = { id: user.id, username: user.username, role: user.role };
                        res.redirect('/'); // Redirigir a la página de inicio
                    });
                });
            });
            
            // Ruta de logout
            router.get('/logout', (req, res) => {
                req.session.destroy((err) => {
                    if (err) {
                        console.error('Error destroying session:', err);
                        return res.status(500).send('Internal server error');
                    }
                    res.redirect('/auth/login');
                });
            });
            
            module.exports = router;
            




