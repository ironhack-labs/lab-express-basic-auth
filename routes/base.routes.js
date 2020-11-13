const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


router.use((req, res, next) => req.session.currentUser ? next() : res.render('login', {errorMsg: 'Zona restringida'}))


router.get('/perfil', (req, res) => res.render('profile', req.session.currentUser))

router.get('/private', (req, res) => res.render('private'))
router.get('/main', (req, res) => res.render('main'))

module.exports = router
