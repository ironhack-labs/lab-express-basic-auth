const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../db/User.model');
const saltRounds = 10;

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
   
    const { username, password } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
      })
      .catch(error => next(error));
  });

  module.exports = router;