const async = require("hbs/lib/async");
const User = require('../models/User.model');
const router = require("express").Router();
const bcrypt = require('bcryptjs');

/* GET home page */
router.get("/home", (req, res, next) => {
    console.log("You are in home now ;)");
    res.render("home");
});

module.exports = router;