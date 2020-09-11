const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


router.use((req, res, next) => {
    if(req.session.currentUser) {
        next()
    } else {
        res.render('login-form', { errorMessage: 'Inicia sesión para acceder!'})
    }
})

router.get('/perfil', (req, res) => res.render('profile', req.session.currentUser))
router.get('/main', (req, res) => res.render('main', req.session.currentUser))

module.exports = router
