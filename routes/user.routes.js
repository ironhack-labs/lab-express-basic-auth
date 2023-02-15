const router = require('express').Router()
const isAuthenticated = require('./../middlewares/isAuthenticated')

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile')
})

module.exports = router