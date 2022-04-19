const router = require('express').Router()
const { isLoggedIn } = require('./../middleware/route-guard')

router.get('/mi-perfil', isLoggedIn, (req, res) => {
    res.render('auth/mi-perfil', { user: req.session.currentUser })
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('private/main', { user: req.session.currentUser })
})
module.exports = router
router.get('/private', isLoggedIn, (req, res) => {
    res.render('private/private', { user: req.session.currentUser })
})
module.exports = router