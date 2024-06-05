// models/campusModel.js
const db = require('../db/database');

const getAllCampuses = (callback) => {
    const sql = 'SELECT * FROM Campus';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

const getCampusById = (id, callback) => {
    const sql = 'SELECT * FROM Campus WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            callback(err);
        } else {
            callback(null, row);
        }
    });
};

const createCampus = (descripcion, estado, callback) => {
    const sql = 'INSERT INTO Campus (descripcion, estado) VALUES (?, ?)';
    db.run(sql, [descripcion, estado], function (err) {
        if (err) {
            console.error(err.message);
            callback(err);
        } else {
            callback(null, { id: this.lastID });
        }
    });
};

const updateCampus = (id, descripcion, estado, callback) => {
    const sql = 'UPDATE Campus SET descripcion = ?, estado = ? WHERE id = ?';
    db.run(sql, [descripcion, estado, id], function (err) {
        if (err) {
            console.error(err.message);
            callback(err);
        } else {
            callback(null);
        }
    });
};

const deleteCampus = (id, callback) => {
    const sql = 'DELETE FROM Campus WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            console.error(err.message);
            callback(err);
        } else {
            callback(null);
        }
    });
};

module.exports = {
    getAllCampuses,
    getCampusById,
    createCampus,
    updateCampus,
    deleteCampus
};
