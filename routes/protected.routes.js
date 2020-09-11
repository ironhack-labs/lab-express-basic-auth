const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.render('index'))

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('iniciar-sesion', { errorMessage: 'Debes iniciar sesión para acceder a esta sección!' })
    }
})

router.get('/main', (req, res) => res.render('main', req.session.currentUser))

router.get('/private', (req, res) => res.render('private', req.session.currentUser))


module.exports = router