const express       = require("express");
const authRoutes    = express.Router();

// User Model
const User          = require("../models/user");

//BCrypt to encrypt passwords
const bcrypt        = require("bcrypt");

// Why do we assign this to 10?
const bcryptSalt    = 10;

// Defines the "/login" page to show the Login form
// to the users
authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
});

// POST request to authenticate the user if the
// username and passwords are correct
authRoutes.post("/login", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({ "username" : username }, (err, user) => {
        if (err || !user) {
            res.render("auth/login", {
                errorMessage: "The username doesn't exist"
            });
            return;
        }

        // What does "compareSync" do?
        if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            // The "request" object has a property called "session" where
            // we can add the values we want to store on it. In this case,
            // we are setting it up with the user's information.

            // The PRESENCE OF THE USER'S INFORMATION IN THE SESSION is what
            // we are going to use to check for a logged in User in the other
            // parts of the app.
            req.session.currentUser = user;

            // Once the user is logged in, we will redirect them to the main page
            // in our site.
            res.redirect("/");
        } else {
            res.render("auth/login", {
                errorMessage: "Incorrect password"
            });
        }
    });
});

authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

// Route to handle user information and to create the user
// with the encrypted password
authRoutes.post("/signup", (req, res, next) => {
    var username    = req.body.username;
    var password    = req.body.password;

    User.findOne({ "username": username },
        "username",
        (err, user) => {
            if (username === "" || password === "") {
                res.render("auth/signup", {
                    errorMessage: "Indicate a username and a password to sign up"
                });
                return;
            }
            
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists"
                });
                return;
            }

        var salt        = bcrypt.genSaltSync(bcryptSalt);
        var hashPass    = bcrypt.hashSync(password, salt);
        
        var newUser     = User({
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

module.exports = authRoutes;