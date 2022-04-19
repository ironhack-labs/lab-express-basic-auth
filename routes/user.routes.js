const router = require('express').Router()

const { isLoggedIn } = require('./../middleware/route-guard')

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('user/profile', { user: req.session.currentUser })
})

router.get('/gatete', isLoggedIn,(req, res) => {
    res.render('gatete', { user: req.session.currentUser })
})

router.get('/gifrechulon', isLoggedIn,(req, res) => {
    res.render('gifrechulon', { user: req.session.currentUser })
})

module.exports = router