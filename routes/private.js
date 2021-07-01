const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

function requireLogin(req, res, next) {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login")
    }
}

router.get("/main", requireLogin, async (req, res) => {
    res.render("private/main");
});

router.get("/private", requireLogin, async (req, res) => {
    res.render("private/private");
});


module.exports = router;