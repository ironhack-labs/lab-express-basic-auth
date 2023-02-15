const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


router.get('/signup', (req, res) => res.render('auth/signUp'));

router.post('/signup', async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render('auth/signUp', { errorMessage: 'Please input all the fields' });
    }


const salt = await bcrypt.genSalt(10);

const hashedPassword = await bcrypt.hash(password, salt);

await User.create({ username, password: hashedPassword });

    res.redirect('/');
  } catch (error) {
   
   /* if (error instanceof mongoose.Error.ValidationError) {
      res.render('auth/signUp', {
        errorMessage: error.message,
      });*/
    if (error.code === 11000) {
      res.render('auth/signUp', {
        errorMessage: 'Email already registered',
      });
    }
    console.log(error);
    next(error);
  }
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!password || !username) {
      res.render('auth/login', { errorMessage: 'Please input all the fields' });
    }

    let user = await User.findOne({ username });

    if (!user) {
      res.render('auth/login', { errorMessage: 'Account does not exist' });
    } else if (bcrypt.compareSync(password, user.password)) {

      req.session.user = user;

      res.redirect('/profile');
    } else {
      
      res.render('auth/login', { errorMessage: 'Wrong credentials' });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/profile', isLoggedIn, (req, res) => {
    let user = req.session.user;
  
    res.render('profile', user);
  });

  router.get('/main', isLoggedIn, (req, res) => {
    let user = req.session.user;
  
    res.render('auth/main', user);
  });
  
  router.get('/private', isLoggedIn, (req, res) => {
    let user = req.session.user;
  
    res.render('auth/private', user);
  });
  
  router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      if (err) next(err);
      else res.redirect('/');
    });
  });
  module.exports = router;
