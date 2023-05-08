const router = require("express").Router();
const { isLoggedIn } = require('../middlewares/route-guard')


router.get('/main', (req, res, next) => {
    res.render("main")
})


router.get('/private', isLoggedIn, (req, res, next) => {
    res.render("private")
})

module.exports = router