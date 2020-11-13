const express = require('express')
const app = require('../app')
const router = express.Router()


// Endpoints
router.get('/', (req, res) => res.render('index'))

// Middleware

router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/loginup-form', {errorMsg: 'Aqui ni te acerques'}))

// Zona privada

router.get('/principal', (req, res) => res.render('private-zone/principal', req.session.currentUser))
router.get('/perfil-privado', (req, res) => res.render('private-zone/perfil-privado', req.session.currentUser))

module.exports = router
