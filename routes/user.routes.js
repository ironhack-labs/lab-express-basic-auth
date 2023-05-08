const router = require('express').Router
const { isLoggedIn } = require('../middlewares/route-guard')

router.get('/perfil', isLoggedIn, (req, res, next) => {
    res.render('user/profile', {

    })
})