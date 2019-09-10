'use strict';

const { Router } = require('express');
const router = Router();




const User = require('../models/user');

const bcrypt = require('bcrypt');

router.post('/sign-up', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({
        username,
        passwordHash : hash
      });
    })
    .then(user => {
      req.session.user = {
        _iD: user._id
      },
      res.redirect('/private');
    })
    .catch(error => {
      console.log('There was an error in the sign up process');
    });
});

router.get('/private', (req, res, next) => {
  res.render('private');
});



module.exports = router; 