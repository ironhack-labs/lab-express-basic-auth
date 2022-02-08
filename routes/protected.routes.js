const router = require("express").Router()

const { isLoggedIn } = require('./../middleware/route-guard')

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("users/main", { user: req.session.currentUser })
})

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("users/private", { user: req.session.currentUser })
})

module.exports = router