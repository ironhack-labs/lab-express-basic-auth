const router = require("express").Router();
const isLoggedIn = require('./../middleware/path-guard')

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('user/private-page')
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/main-page')
})

module.exports = router;