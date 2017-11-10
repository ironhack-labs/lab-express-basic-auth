/* var express = require('express');
const router = express.Router();
const User = require("../models/user").User;

User.findOne({
    "username": username
});

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("auth/login");
    }
});

router.get("/", (req, res, next) => {
    res.render("main");
});

module.exports = router; */