const router = require("express").Router()

const { isLoggedIn } = require('./../middleware/route-guard')

router.get("/profile", isLoggedIn, (req, res, next) => {
    console.log(req.session.currentUser + "12312heyyyyy")
    res.render("../views/users/user-profile", { user: req.session.currentUser })
})


router.get('/main', isLoggedIn, (req, res, next) => {       // Middleware de ruta
    res.render('../views/users/main')
})

router.get('/private', isLoggedIn, (req, res, next) => {       // Middleware de ruta
    res.render('../views/users/private')
})

module.exports = router