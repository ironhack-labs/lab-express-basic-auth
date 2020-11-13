const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.use((req, res, next) => req.session.currentUser ? next() : res.render('main', { errorMsg: 'Zona restringida' }))

router.use('/private', (req, res) => res.render('private', req.session.currentUser))

module.exports = router
