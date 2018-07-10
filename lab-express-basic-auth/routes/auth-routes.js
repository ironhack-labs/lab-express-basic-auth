const express = require('express');
const authRoutes = express.Router();

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});
//  aqui creo la nueva ruta
authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});
//  ahora creo posts porque necesito ahora enviar información para hacer submit del form.
authRoutes.post('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

module.exports = authRoutes;
