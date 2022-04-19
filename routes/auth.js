const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res, next) => res.render('auth/signup'));


router.get('/user', (req, res, next) => {

  User.find()
  .then(userFound => {
    console.log(userFound);
  })
});


router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  console.log(username, password)

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log(hashedPassword)
        return User.create({ username, password: hashedPassword }); // <-- returned so we can use below. 
    })
    .then(userCreated => {
      console.log(`Created new user:`, userCreated);
    })
    .catch(err => {
      console.log('Error creating new user')
    })
});

module.exports = router;