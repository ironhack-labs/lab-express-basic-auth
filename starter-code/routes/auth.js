const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/signup', (req, res) => {
  res.render('signup-form')
});

router.post('/signup', (req, res) => {
  // let username = req.body.username;
  // let password = req.body.password;
  // instead, ES6 syntax:
  let {username, password} = req.body;
  const salt = 10;
  const bsalt = bcrypt.genSaltSync(salt);
  password = bcrypt.hashSync(password, bsalt);
  User.create({username, password})
    .then(user => {
      console.log(`There is a new user in your DB. Username: '${user.username}', created at: ${user.createdAt}`)
      res.redirect('/')
    })
    .catch(error => {
      res.render('signup-form', {error: 'Please try again with different credentials, there was an error creating your account'})
    })
});

router.get('/login', (req, res) => {
  res.render('login-form')
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;
  User.findOne({username})
    .then(user => {
      if(bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/')
      } else {
        res.render('login-form', {passErr: 'Your password is incorrect'})
      }
    })
    .catch(userErr => {
      res.render('login-form', {userErr: 'Your username does not exist, please try again'})
    })
  });



module.exports = router;
