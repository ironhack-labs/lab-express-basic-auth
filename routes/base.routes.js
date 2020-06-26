const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('home'))


// Login checker
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('home', { errorMsg: 'Restricted area' })
    }
})


router.get('profile', (req, res) => {
    res.render('auth/profile', req.session.currentUser)
})

module.exports = router