const express = require('express')
const { isLoggedIn, isLoggedOut } = require('../middlewares/route-guard')
const router = express.Router()

router.get('/perfil', isLoggedIn, (req, res, next) => {
    res.render('user/profile', { user: req.session.currentUser })
})

router.get('/main', (req, res, next) => {
    res.render('user/public', { user: req.session.currentUser })
})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('user/private', { user: req.session.currentUser })
})

module.exports = router