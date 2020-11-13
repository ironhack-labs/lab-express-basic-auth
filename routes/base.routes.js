const express = require('express');
const app = require('../app')
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// router.get('/iniciar-sesion', (req, res) => res.render('auth/login-form'));


// custom middleware for session check
//router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/login-form', { errorMsg: 'Zona restringida' }))

// todas las rutas a continuación serán privadas
// router.get('/perfil', (req, res) => res.render('profile', req.session.currentUser))






module.exports = router;
