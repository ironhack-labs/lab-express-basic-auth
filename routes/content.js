const router = require("express").Router()
const { isLoggedIn } = require("../middleware/route-guard")

router.get("/profile/main", isLoggedIn, (req, res, next) => {
    res.render("main")
})

router.get("/profile/private", isLoggedIn, (req, res, next) => {
    res.render("private")
})

module.exports = router;