const router = require('express').Router()

const { isLoggedIn } = require('./../middleware/route.guard')

router.get('/main', isLoggedIn, (req, res) => {
    res.render('main', { user: req.session.currentUser })
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('private', { user: req.session.currentUser })
})

module.exports = router