const express = require('express');
const authRoutes = express.Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRoutes.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") { //Validation for blank fields
    res.render('auth/signup', {
      errorMessage: "Please input a username and a password!"
    });
    next();
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        res.render('auth/signup', {
          errorMessage : "The user does not exist"
        });
        return;
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.render('index', {user});
      } else {
        res.render('auth/login', {
          errorMessage: "Wrong password"
        });
        return;
      }
    })
    .catch(err => console.log(err));
});

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") { //Validation for blank fields
    res.render('auth/signup', {
      errorMessage: "Please input a username and a password!"
    });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {//Validation for existing users
        res.render('auth/signup', {
          errorMessage: "User already exists!"
        });
        return; //To exit the callback
      }

      const newUser = User({
        username: username,
        password: hashPass
      });

      newUser.save()
        .then(() => res.redirect("/"))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

});

module.exports = authRoutes;