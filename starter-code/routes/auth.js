const express = require('express');
const router = express.Router();
//Añadimos el modelo
const User = require('../models/User');
//requerimos el bcrypt
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

router.get('/', (req, res, next) => {
    res.render('home')
});
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});
router.get('/login', (req, res, next) => {
    res.render('auth/login')
});
router.get('/secret', (req, res, next) => {
    res.render('secret')
});

module.exports = router;