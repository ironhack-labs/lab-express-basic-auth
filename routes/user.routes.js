const router = require("express").Router();

const { isLoggedIn } = require('./../middleware/session-guard')

router.get('/mi-perfil', isLoggedIn, (req, res) => {
    res.render('user/profile', { user: req.session.currentUser })
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/main')
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private')
})


module.exports = router