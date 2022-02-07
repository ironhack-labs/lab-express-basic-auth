const router = require("express").Router()

const { loggedIn } = require("./../middleware/route-guard")

router.get("/perfil", loggedIn, (req, res, next) => {
    res.render("users/user-profile", { user: req.session.currentUser })
})
module.exports = router