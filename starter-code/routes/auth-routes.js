const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const authRoutes = express.Router();
const User = require('../models/user');


authRoutes.get('/', (req, res, err) => res.render('index'))

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post('/signup', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let salt = bcrypt.genSaltSync(saltRounds);
  let hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    return res.render("auth/signup", {
      errorMessage: "Enter a username and a password to sign up"
    });
  }

  User.findOne({
    "username": username
  }, "username", (err, user) => {
    if (user) {
      res.render('auth/signup', {
        errorMessage: "This username has been taken, try another one"
      });
    } else {
      const newUser = User({
        username: username,
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect('/');
      });
    }
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
        res.redirect("/main");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

authRoutes.get('/main', (req, res, next) => {
  res.render('auth/main');
});

authRoutes.get('/private', (req, res, next) => {
  res.render('auth/private');
});

module.exports = authRoutes;
