const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/userProfile', (req, res) => {
  res.render('users/user-profile');
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword,
      }).then((userFromDB) => {
        console.log('Newly created user is:', userFromDB);
        res.redirect('/userProfile');
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
