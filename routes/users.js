 
const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/signup', (req, res) => res.render('auth/signup'));
 
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;
  bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/index');
    })
    .catch(error => next(error));
});
 
module.exports = router;
 

