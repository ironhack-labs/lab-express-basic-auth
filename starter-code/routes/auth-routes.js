const express = require("express");
const authRoutes = express.Router();
const User       = require("../models/users");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
  
});

authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);
  if (username === "" || password === "") {
    res.send({
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/signup", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/signup", {
        errorMessage: "Incorrect password"
      });
    }
  });

  var newUser = User({
    username,
    password: hashPass
  });

  newUser.save(err => {
    if (err) {
      res.render("auth/signup", {
        errorMessage: "Something went wrong"
      });
    } else {
      res.redirect("/views/index");
    }
  });
});

module.exports = authRoutes;