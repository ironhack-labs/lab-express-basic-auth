const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");



// SIGNING UP ROUTES

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  //collect sign-up input
  const {
    username,
    password
  } = req.body;
  //restriction checks
  if (!username) {
    res.render("signup.hbs", {
      message: "Username cannot be empty"
    });
    return;
  }
  if (!password) {
    res.render("signup.hbs", {
      message: "Password cannot be empty"
    });
    return;
  }
  User.findOne({
      username
    }).then(found => {
      if (found) {
        res.render("signup.hbs", {
          message: "This username is already taken"
        });
        return;
      }
      //password encryption
      bcrypt
        .genSalt()
        .then(salt => {
          return bcrypt.hash(password, salt);
        })
        //new User creation
        .then(hash => {
          return User.create({
            username: username,
            password: hash
          });
        })
        //add new User to current session
        .then(newUser => {
          req.session.user = newUser;
          res.redirect("/");
        });
    })
    .catch(err => {
      next(err);
    });
});



// LOGGING IN ROUTES

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  //collect log-in input
  const {
    username,
    password
  } = req.body;
  //check username validity
  User.findOne({
      username: username
    })
    .then(found => {
      if (!found) {
        res.render("login.hbs", {
          message: "Invalid credentials, try again"
        });
        return;
      }
      //check password validity
      return bcrypt.compare(password, found.password).then(bool => {
        if (bool === false) {
          res.render("login.hbs", {
            message: "Invalid credentials, try again"
          });
          return;
        }
        //start session for User
        req.session.user = found;
        res.redirect('/');
      });
    })
    .catch(err => {
      next(err);
    });
});









module.exports = router;