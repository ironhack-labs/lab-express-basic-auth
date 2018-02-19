const express     = require("express");
const authRoutes  = express.Router();

//User Model
const User        = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt      = require("bcrypt");
const bcryptSalt  = 10;

authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });

  //Route to Handle Signup Form Permission
authRoutes.post("/signup", (req, res, next) => {
    var username  = req.body.username;
    var password  = req.body.password;

    //Validation to check  
    if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    };

    User.findOne({ "username": username },
    "username",
    (err, user) => {
        if (user !== null) {
            res.render("auth/signup", {
            errorMessage: "The username already exists"
            });
            return;
        };

        var salt      = bcrypt.genSaltSync(bcryptSalt);
        var hashPass  = bcrypt.hashSync(password, salt);

        var newUser  = User({
            username,
            password: hashPass
        });
      
        newUser.save((err) => {
            if(err) {
              res.render("auth/signup", {
                  errorMessage: "Something went wrong"
              });
            } else { 
            res.redirect("/");
            };
        });
    });
});

module.exports = authRoutes;