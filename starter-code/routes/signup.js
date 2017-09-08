const express = require("express");
const userModel = require('../model/user');
const bcrypt = require("bcrypt");
const router = express.Router();
const bcryptSalt = 10;

router.get('/signup',(req, res, next) => {
    res.render('signup');
});

router.post('/signup', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    if (username === "" || password === "") {
        res.render("signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    userModel.findOne({ "username": username }, "username", (err, user) => {
        if (user !== null) {
            res.render("signup", {
                errorMessage: "The username already exists"
            });
            return;
        }

        var salt = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);

        var newUser = new userModel({
            username,
            password: hashPass

        });

        newUser.save((err) => {
            if (err) {
                res.render("signup", {
                    errorMessage: "Something went wrong when signing up"
                });
            } else {
                res.redirect('welcome');
            }
        });

    });

});

module.exports = router;
