const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User.model");

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  // get username and password
  const { username, password } = req.body;
  // check if username is correct -> exists in our database if not render login again
  User.findOne({ username: username })
    .then(found => {
      if (found === null) {
        res.render('login', { message: 'Invalid credentials' })
      }
      // username exists in our database
      // check if the password matches the password for that user in the database
      if (bcrypt.compareSync(password, found.password)) {
        // password and hash match
        // login the user
        req.session.user = found;
        res.redirect('/');
      } else {
        res.render('login', { message: 'Invalid credentials' })
      }
    })
});


router.post('/signup', (req, res, next) => {
  // check if the password is long enough and username is not empty
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render('signup', { message: 'Your password must be 8 chars min' });
  }
  if (username === '') {
    res.render('signup', { message: 'Your username cannot be empty' });
  }
  // check if the username already exists
  User.findOne({ username: username })
    .then(found => {
      if (found !== null) {
        res.render('/signup', { message: 'This Username is already taken' })
      } else {
        // we can create a user and add the hashed password 
        const salt = bcrypt.genSaltSync();
        console.log(salt);
        const hash = bcrypt.hashSync(password, salt);
        User.create({ username: username, password: hash })
          .then(dbUser => {
            // log in
            req.session.user = dbUser;
            res.redirect('/');
          })
          .catch(err => {
            // console.log(err);
            next(err);
          })
      }
    })
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.redirect('/')
    }
  })
});


module.exports = router;