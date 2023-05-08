const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')
const router = express.Router()

const User = require('./../models/User.model')


// profile
router.get("/perfil", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})



// private
router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("user/private", { user: req.session.currentUser })
})


module.exports = router