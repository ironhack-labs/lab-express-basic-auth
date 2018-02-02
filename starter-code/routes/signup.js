const express = require('express');
const router = express.Router();
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/', (req, res, next) => {
    res.render("signup")
})
router.post('/', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username === "" || password === "") {
        res.render("signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }
    User.findOne({ "username": username },
        "username",
        (err, user) => {
            if (user !== null) {
                res.render("signup", {
                    errorMessage: "The username already exists"
                });
                return;
            }
            let salt = bcrypt.genSaltSync(bcryptSalt);
            let hashPass = bcrypt.hashSync(password, salt);
            let newUser = User({
                username,
                password: hashPass
            });
            newUser.save((err) => {
                res.redirect("/");
            });
        });
});

module.exports = router;
