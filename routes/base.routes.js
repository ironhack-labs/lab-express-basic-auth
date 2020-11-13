const express = require('express')
const app = require('../app')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/login-form', { errorMsg: 'Zona restringida' }))


router.use((req, res, next) => req.session.currentUser ? res.render('auth/main') : res.render('auth/login-form'))



router.get('/perfil', (req, res) => res.render('index', req.session.currentUser))

module.exports = router
