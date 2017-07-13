const express = require("express");
const User    = require("../models/user");

const bcrypt  = require("bcrypt");

const bcryptSalt     = 10;

const authRoutes = express.Router();

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ "username": username }, "username",(err, user) => {
        if (user !== null) {
            return res.render("auth/signup", {
                errorMessage: "The username already exists"
            }); 
        }
        var salt     = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);
            if (username === "" || password === "") {
                return res.render("auth/signup", {
                    errorMessage: "Indicate a username and a password to sign up"
                });
            }
        var newUser  = User({
            username,
            password: hashPass
        });

       newUser.save((err) => {
            if (err) {
                res.render("auth/signup", {
                    errorMessage: "Something went wrong"
                });
            } else {
                res.redirect("/");
            }
        });
    });
});


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});



authRoutes.post("/login", (req, res, next) => {
    
  res.render("auth/login");
});
// User model

// BCrypt to encrypt passwords


module.exports = authRoutes;