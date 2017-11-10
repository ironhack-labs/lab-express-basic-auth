const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');

const router = express.Router();
const bcryptSalt = 10;

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
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
        username: username,
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });
});



module.exports = router;
