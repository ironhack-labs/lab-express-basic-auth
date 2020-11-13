const express = require('express')
const app = require('../app')
const router = express.Router()


router.get('/', (req, res) => res.render('index'))


router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/login-form', { errorMsg: 'Zona restringida' }))


router.get('/perfil', (req, res) => res.render('main', req.session.currentUser))

router.get('/privado', (req, res) => res.render('private', req.session.currentUser))

module.exports = router
