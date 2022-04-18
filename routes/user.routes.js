const router = require('express').Router()

const { isLoggedIn } = require('./../middleware/route-guard')

// hemos configurado session en config

router.get('/mi-perfil', isLoggedIn, (req, res) => {

    res.render('user/profile', { user: req.session.currentUser })
})

router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('main')
})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('private')
})

module.exports = router