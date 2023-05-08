const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')
const router = express.Router()

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("user/private", { user: req.session.currentUser })//te redirige a startSession y loguearte
})

module.exports = router