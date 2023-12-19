const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');


router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword
      });

    })
    .then(userFromDB => {
        res.render('index', { user: userFromDB });
      })
    .catch(error => next(error));
});




//////////// L O G I N ///////////

router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
  
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
  
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
          res.render('index', { user: user });
        } else {
          console.log("Incorrect password. ");
          res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        }
      })
      .catch(error => next(error));
  });
  router.get('/home', (req, res) => {
    res.render('index', { user: {} });
  })
  
  router.get('/main', (req, res) => {
    res.render('main', { user: {} });
  })
  
  router.get('/private', (req, res) => {
    res.render('private', { user: {} });
  })
  

  module.exports = router;