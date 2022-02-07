const router = require("express").Router()

const { loggedIn } = require("./../middleware/route-guard")

router.get("/main", loggedIn, (req, res, next) => {
    res.render("users/main", { user: req.session.currentUser })
})

router.get("/private", loggedIn, (req, res, next) => {
    res.render("users/private", { user: req.session.currentUser })
})

module.exports = router