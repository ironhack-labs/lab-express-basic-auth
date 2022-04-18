
const router = require('express').Router()

const { isLoggedIn } = require('./../middleware/route-guard')


router.get('/mi-perfil', isLoggedIn, (req, res) => {

    // res.send('mi perfkil')
    res.render('user/profile', { user: req.session.currentUser })
})

router.get('/principal', isLoggedIn, (req, res) => {
    res.render('user/main')
})

router.get('/privado', isLoggedIn, (req, res) => {
    res.render('user/private')
})

module.exports = router