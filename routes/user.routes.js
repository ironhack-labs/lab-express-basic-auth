const router = require("express").Router()
const { isLogged } = require('./../middleware/router.guard')

router.get('/perfil', isLogged, (req, res, next) => {
    res.render('user/user-profile', { user: req.session.currentUser })
})

router.get('/main', isLogged, (req, res, next) => {
    res.render('user/main-user', { user: req.session.currentUser })
})

router.get('/private', isLogged, (req, res, next) => {
    res.render('user/private-user', { user: req.session.currentUser })
})


module.exports = router