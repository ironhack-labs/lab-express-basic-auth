const express = require('express');

const router = express.Router();

const User = require('../models/user');

const bcrypt = require('bcrypt');

const bcryptSalt = 10;


router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    res.render('auth/signup', {
      message: 'Provide username and password'
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup', { message: 'This username already exists' });
        return;
      }
      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          res.redirect('/');
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login', { message: 'Both fields are required sign up.' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', { message: "No username found!" });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', { message: 'Incorrect password' });
      }
    })
    .catch((error) => {
      next(error);
    });
});




module.exports = router;