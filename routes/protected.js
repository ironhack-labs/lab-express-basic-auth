const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

function requireLogin(req, res, next) { //to make create book only accessible to the logged in users
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login")
    }
};


//renders create a book    this space meant for middleware --------- you put the middleware if u want to control access
router.get("/main", requireLogin, (req, res, next) => {
  res.render("protected/main");
});

router.get("/private", requireLogin,  (req, res, next) => {
  res.render("protected/private");
});

module.exports = router;
