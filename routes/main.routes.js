const express = require('express')
const router = express.Router()
const bcryptjs = require("bcryptjs")
const bcryptjsSalt = 10

const User = require('./../models/user.model')
const app = require('../app')


// custom middleware for session check
router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/login-form', { errorMsg: 'Zona restringida' }))


// todas las rutas a continuación serán privadas
router.get('/main', (req, res) => res.render('main', req.session.currentUser))


module.exports = router
