var express = require('express');
var router = express.Router();

// User model
const User = require("../models/user").User;

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// login
router.get('/login', function (req, res, next) {
    res.render('auth/login');
});

router.post('/login', function (req, res, next) {
    res.send('respond with a resource');
});

//sign-up

router.get('/signup', function (req, res, next) {
    res.render('auth/signup');
});

router.post("/signup", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
        username,
        password: hashPass
    });

    newUser.save((err) => {
        res.redirect("/");
    });
});

module.exports = router;