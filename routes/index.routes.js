const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;
 
router.get('/', (req, res, next) => res.render('index'));
router.get('/signup', (req, res) => res.render('auth/signup'));
 
// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword
      });
    })
.then(userFromDB => {
    console.log('Newly created user is: ', userFromDB);
    res.redirect('/userProfile');
})
    .catch(error => next(error));
});

router.get('/userProfile', (req, res) => res.render('user/userProfile'));


module.exports = router;
