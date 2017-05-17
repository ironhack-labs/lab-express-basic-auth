/*jshint esversion: 6 */

const express = require('express');
const authR = express.Router();
const strength = require('zxcvbn');

const User = require('../models/users');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;



authR.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authR.post("/signup", (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;
  const temp = strength(password);
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);


  var newUser = User({
    username,
    password: hashPass
  });

  if (username === "" || password === "") {
    res.render('auth/signup', {
      errorMessage: "Please enter a username and password!"
    });
    return;
  }

  if (temp.score < 3) {
    res.render('auth/signup', {
      errorMessage: "Please use a stronger password!!! " + temp.feedback.warning + " " + temp.feedback.suggestions

    });
    return;
  }

  User.findOne({"username": username},
    "username",
    (err,user) => {
      if (user !== null) {
      res.render('auth/signup', {
        errorMessage: 'The username already exists'
    });
    return;
  }

  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username, // this is only allowed on ES6
              // regularly it can also be expressed as username: username
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      res.render('auth/signup', {
        errorMessage: "Something went wrong"
      });
    } else {
      res.redirect("/");
    }
  });
  });
});

authR.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authR.post("/login", (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render('auth/login', {
      errorMessage: "Indicate a username and password!"
    });
    return;
  }

  User.findOne({"username": username}, (err,user) => {
      if (err || !user) {
      res.render('auth/login', {
        errorMessage: 'The username doesnt exist'
    });
    return;
  }

  if(bcrypt.compareSync(password, user.password)) {
    console.log("this is session: ", req.session);
    req.session.currentUser = user;
    res.redirect('/');
  } else {
    res.render("auth/login", {
      errorMessage: "Incorrect Password"
    });
  }
  });
});

authR.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

module.exports = authR;
