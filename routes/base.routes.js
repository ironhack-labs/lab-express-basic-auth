const express = require('express')
const router = express.Router()

const app = require('../app')

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/login-form', {errorMsg: 'Necesitas autentificarte para acceder a esta zona'}))

router.get('/main', (req, res) => res.render('main', req.session.currentUser))
router.get('/private', (req,res) => res.render('private', req.session.currentUser))

module.exports = router
