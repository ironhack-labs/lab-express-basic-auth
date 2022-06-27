const router = require("express").Router();

const { isLoggedIn } = require('./../middleware/session-guard')

router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/main', { user: req.session.currentUser })
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private', { user: req.session.currentUser })
})

module.exports = router