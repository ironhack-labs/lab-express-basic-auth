const router = require("express").Router()
const { isLoggedIn } = require('../middlewares/route-guard')

router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("user/main")
})

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("user/private")
})

module.exports = router
