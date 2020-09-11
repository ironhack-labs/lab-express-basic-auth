const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))

// Middleware personalizado de detección de sesión
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('login', { errorMessage: 'Inicia sesión para acceder...' })
    }
})
// Equivalencia pro! yay!
// router.use((req, res, next) => req.session.currentUser ? next() : res.render('login', { errorMessage: 'Inicia sesión para acceder...' }))

router.get('/main', (req, res) => {

    res.render('main')
})
router.get('/private', (req, res) => res.render('private', req.session.currentUser))


module.exports = router
