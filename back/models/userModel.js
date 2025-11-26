const db = require('../config/db');

const getUserByEmail = (email, callback) => {
  db.query('SELECT * FROM user WHERE email = ?', [email], callback);
};

const createUser = (userData, callback) => {
  db.query('INSERT INTO user SET ?', userData, callback);
};

const updateUser = (id_user, data, callback) => {
  db.query('UPDATE user SET ? WHERE id_user = ?', [data, id_user], callback);
};

const getUserById = (id_user, callback) => {
  db.query('SELECT id_user, nombre, email, rol_fk FROM user WHERE id_user = ?', [id_user], callback);
};

module.exports = { getUserByEmail, createUser, updateUser, getUserById };
