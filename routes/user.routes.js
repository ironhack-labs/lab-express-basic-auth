const express = require('express');
const { isLoggedIn } = require('../middlewares/route-guard');
const router = express.Router()
const User = require("../models/User.model")


router.get("/main", isLoggedIn, (req, res) => {
    res.render("user/main")
})
router.get("/private", isLoggedIn, (req, res) => {
    res.render("user/private")
})
router.get("/my-account", isLoggedIn, (req, res) => {
    res.render("user/my-account", { user: req.session.currentUser })
})
module.exports = router;
