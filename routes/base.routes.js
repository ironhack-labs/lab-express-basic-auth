const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


// Custom middleware
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    }
    else {
        res.render('login', { errorMsg: 'Desautorizado, iniciar sesión antes' })
    }
})

router.get('/profile', (req, res) => {
    const userName = req.session.currentUser
    res.render('profile', userName)
})


module.exports = router