const express = require('express')
const { isLoggedIn } = require('./../middlewares/route-guard')
const router = express.Router()

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("user/main", { user: req.session.currentUser })
})

router.get("/autenticado", isLoggedIn, (req, res, next) => {
    res.render("user/authenticate", { user: req.session.currentUser })
})

router.get("/privado", isLoggedIn, (req, res, next) => {
    res.render("user/private", { user: req.session.currentUser })
})

module.exports = router