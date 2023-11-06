const router = require("express").Router()

const { isLoggedIn } = require('../middleware/route-guard')

router.get("/perfil", isLoggedIn, (req, res) => {
    res.render("user/profile", { user: req.session.currentUser })
})

module.exports = router