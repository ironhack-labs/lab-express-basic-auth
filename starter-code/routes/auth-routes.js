const express = require('express');
const authRoutes  = express.Router();

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRoutes.post('/login', (req, res, next) => {

});

authRoutes.get('/signup', (req, res, next) => {

});

authRoutes.post('/signup', (req, res, next) => {

});

module.exports = authRoutes;