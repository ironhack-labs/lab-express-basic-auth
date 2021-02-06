const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))

// Custom middleware
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('auth/login-form', { errorMsg: 'Log in first!' })
    }
})

router.get('/login', (req, res) => res.render('./auth/private'))


module.exports = router