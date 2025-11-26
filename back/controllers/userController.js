const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

require('dotenv').config();
const secret = process.env.JWT_SECRET;

exports.register = (req, res) => {
  const { nombre, email, password, rol_fk } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Error al encriptar la contraseña' });
    const userData = { nombre, email, password: hash, rol_fk };
    userModel.createUser(userData, (err) => {
      if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
      res.json({ message: 'Usuario registrado correctamente' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  userModel.getUserByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) return res.status(401).json({ error: 'Contraseña incorrecta' });
      const token = jwt.sign({ id_user: user.id_user }, secret, { expiresIn: '2h' });
      res.json({ token });
    });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.user.id_user;
  userModel.getUserById(userId, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id_user;
  const data = req.body;
  if (data.password) {
    bcrypt.hash(data.password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Error al encriptar nueva contraseña' });
      data.password = hash;
      userModel.updateUser(userId, data, (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar perfil' });
        res.json({ message: 'Perfil actualizado correctamente' });
      });
    });
  } else {
    userModel.updateUser(userId, data, (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar perfil' });
      res.json({ message: 'Perfil actualizado correctamente' });
    });
  }
};
