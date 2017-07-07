const express = require("express");
const routes = express.Router();

// User model
const User = require("../models/User");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
routes.get("/", (req, res, next) => {
  res.render("auth/signup");
});

routes.get("/signup", (req, res, next) => {

  res.render("auth/signup");
});

routes.get("/login", (req, res, next) => {
  console.log("hola");
  res.render("auth/login");
});

routes.post("/login", (req, res, next) => {
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
        res.render('index', {
    title: 'Express',
    session:req.session.currentUser
  });
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

routes.post("/signup", (req, res, next) => {

  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  } else {
    User.findOne({
        "username": username
      },
      "username",
      (err, user) => {
        if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists"
          });
          return;
        } else {

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
              res.redirect("/");
            }
          });
        }
      });
  }
});

routes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/");
  });
});
module.exports = routes;
