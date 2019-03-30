const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const User = require('../models/user');

// -- The /user route -- //

// CREATE
router.get('/create', (req, res, next) => {
  res.render('./user/create.hbs')
});

router.post('/create', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      return User.create({
        username: req.body.username,
        password: hash
      })
    })
    // user created -> redirect
    .then(user => {
      console.log(`user created: ${user.username}`);
      res.redirect('/');
    })
    // schema validation / errors
    .catch(err => {
      if
        (err.code == 11000) {
        res.render('./user/create', { errorMsg: 'This username already exists' })
      } else if
        (err.errors.username.kind == 'required') {
        res.render('./user/create', { errorMsg: 'Enter a username' })
      } else if
        (err.errors.password.kind == 'required') {
        res.render('./user/create', { errorMsg: 'Enter a password' })
      } else {
        console.log('new error for signup: ', err);
      }
    })
});

// LOGIN
router.get('/login', (req, res, next) => {
  res.render('./user/login.hbs');
});

router.post('/login', (req, res, next) => {
  let currentUser = '';
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user == null) {
        res.render('./user/login.hbs', { errorMsg: "Username not found" });
      } else {
        currentUser = user;
        return bcrypt.compare(req.body.password, user.password) // returns true or false
      }
    })
    .then(result => {
      if (result) {
        req.session.currentUser = currentUser;
        res.redirect('/member')
      } else {
        res.render('./user/login.hbs', { errorMsg: "Invalid password" });
      }
    })
    .catch(err => {
      console.log(err);
    })
})

module.exports = router;