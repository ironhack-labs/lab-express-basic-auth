const express = require("express");
const authRoutes = express.Router();

authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});
const User = require("../models/user");

const bcrypt = require("bcryptjs");
const bcryptSalt = 14;

authRoutes.post("/signup", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username,password);
    bcrypt.genSalt(bcryptSalt, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {

            var newUser = User({
                username,
                password: hash
            });
        
            newUser.save((err) => {
                if (username === "" || password === "") {
                    res.render("auth/signup", {
                        errorMessage: "Indicate a username and a password to sign up"
                    });
                    res.redirect("/");

                    return;
                }
                // User.findOne({ "username": username },
                // "username",
                // (err, user) => {
                //   if (user !== null) {
                //     res.render("auth/signup", {
                //       errorMessage: "The username already exists"
                //     });
                //     return;
                //   }
                // });
            });
        });

    });

});


module.exports = authRoutes;