const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/login', { errorMsg: 'Zona restringida' }))

router.get('/private', (req, res) => res.render('private', req.session.currentUser))
router.get('/main', (req, res) => res.render('main', req.session.currentUser))

module.exports = router
