const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('login-form', {
            errorMessage: 'Inicia sesión para utilizar esta web vacía'
        })
    }
})

router.get('/profile', (req, res) => res.render('profile', req.session.currentUser))

module.exports = router