const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const session = require('express-session');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});
  
router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/private', (req, res) => {
  res.render('auth/private');
});

router.get('/main', (req, res) => {
  res.render('auth/main');
});




router.post('/login', (req, res, next) => {

    const { username, password } = req.body;

    User.findOne({ username: username})
    .then(found => {
        if (found === null) {
            res.render('auth/login', {message: 'Invalid credentials'})
        }
        if (bcrypt.compareSync(password, found.password)) {
            req.session.user = found;
            res.redirect('/');
        } else {
            res.render('auth/login', {message: 'Invalid credentials'})
        }
    })


});

router.post('/signup', (req, res, next) => {
    // check if the password is long enough and username is not empty
    const { username, password } = req.body;
    console.log('This', req.session.user)
    if (password.length < 8) {
      res.render('auth/signup', { message: 'Your password must be 8 chars min' });
      return;
    }
    if (username === '') {
      res.render('auth/signup', { message: 'Your username cannot be empty' });
      return;
    }
    
    // check if the username already exists
    User.findOne({ username: username })
      .then(found => {
        if (found !== null) {
          res.render('auth/signup', { message: 'This Username is already taken' })
        } else {
          // we can create a user and add the hashed password 
          const salt = bcrypt.genSaltSync();
          console.log(salt);
          const hash = bcrypt.hashSync(password, salt);
          User.create({ username: username, password: hash })
            .then(dbUser => {
              // log in
              dbUser = req.session.user;
              console.log(dbUser)
              res.redirect('/');
            })
            .catch(err => {
              // console.log(err);
              next(err);
            })
        }
      })
});

router.post('/logout', (req, res, next)=> {
  req.session.destroy();
  res.redirect('/');
})









module.exports = router;