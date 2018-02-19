const express        = require("express");
const authRoutes     = express.Router();
const User           = require("../models/user");

//encryption
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
//encryption ends

//ROUTE - RENDER SIGNUP FORM
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//ROUTE - POST SIGNUP
authRoutes.post("/signup", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    //checks if user left username or password empty
    if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }
    //checks if username already exists
    User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
        res.render("auth/signup", {
            errorMessage: "The username already exists"
        });
            return;
        }
        //set up bcrypt
        var salt     = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);

        var newUser  = User({
          username,
          password: hashPass
        });
        //saving new username and password to database
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
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = authRoutes;