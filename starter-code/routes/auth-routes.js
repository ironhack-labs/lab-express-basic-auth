const express = require("express");
const authRoutes = express.Router();

//User Model
const User = require("../models/user");

// Bcrypt to Encrypt Passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Route to Display Signup Form
authRoutes.get("/signup", (req, res, next) => {
res.render("auth/signup");
});

// route for login
authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
    });

// Route to Handle Signup Form Submission
authRoutes.post("/signup", (req, res, next) => {
var username = req.body.username;
var password = req.body.password;

// Validation to check whether user has submitted anything
if (username === "" || password === "") {
    res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up"
    });
}

User.findOne({"username": username},
    "username",
    (err, user) => {
        if (user !== null) {
            res.render("auth/signup", {
                errorMessage: "The username already exists"
            });
            return;
        }

var salt = bcrypt.genSaltSync(bcryptSalt);
var hashPass = bcrypt.hashSync(password, salt);

var newUser = User({
    username,
    password: hashPass
});
newUser.save((err) => {
    if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("auth/login");
             }
    // res.redirect("auth/login");
    //     });
    });
});
        
        
        module.exports = authRoutes;