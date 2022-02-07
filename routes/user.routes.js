const res = require("express/lib/response")
const bcryptjs = require('bcryptjs')

const router = require("express").Router()
const { isLoggedIn } = require('./../middleware/route-guard')
router.get("/perfil", (req, res, next) => {

    console.log(req.session.currentUser)
    res.render("../views/profile/profile", {user: req.session.currentUser})
})

router.get('/principal', isLoggedIn, (req, res, next) => {       
    res.render('../views/profile/main')
})

router.get('/privado', isLoggedIn, (req, res, next) => {       
    res.render('../views/profile/private')
})

module.exports = router;