const express = require("express");
const router = express.Router();
const authStatus = require('../middlewares/authStatus.js');

router.get("/", (req, res, next) => {
    res.render("home");
});

router.get("/private", authStatus, (req, res, next) => {
    res.render("secret.hbs");
});

router.get("/logout", (req, res, next) => {
    req.session.destroy((dbErr) => {
        res.redirect("/login");
    });
});

module.exports = router;