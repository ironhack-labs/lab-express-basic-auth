const router = require("express").Router()

const { isLoggedIn } = require("../middleware/route-guard")

router.get("/perfil", isLoggedIn, (req, res, next) => {
    res.render("users/user-profile", { user: req.session.currentUser })
})

router.get("/perfil/principal", isLoggedIn, (req, res, next) => {
    res.render("users/main")
})

router.get("/perfil/privado", isLoggedIn, (req, res, next) => {
    res.render("users/private")
})

module.exports = router