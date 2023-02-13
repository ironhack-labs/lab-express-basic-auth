const express = require('express');
const { isLoggedIn } = require('../middlewares/route-guard');
const router = express.Router();



router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("user/main", { user: req.session.currentUser })
})

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("user/private", { user: req.session.currentUser })
})

router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})

module.exports = router