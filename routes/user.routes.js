const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')
const router = express.Router()

router.get("/perfil", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/main')
})
router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private')
})

module.exports = router