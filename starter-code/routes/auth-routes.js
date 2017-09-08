const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//redirect to signup page
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//create a user and encrypt password check if user exists
authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    username,
    password: hashPass
  });

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username",  (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }


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

//redirect to login page
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

//login a user and check if it matches
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
      if (err) {
        res.render("auth/login", {
          errorMessage: "Something went wrong!"
        });
        return;
      }
      else if (!user) {
        res.render("auth/login", {
          errorMessage: "Username doesn't exist!"
        });
        return;
      }

      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("private");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect Details."
        });
      }
  });
});




module.exports = authRoutes;
