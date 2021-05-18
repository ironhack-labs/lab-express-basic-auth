const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 12;

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', async (req, res, next) => {
  const { username, email, password} = req.body;
  //error handling
  if (!username || !email || !password) {
    //The test() method executes a search for a match between a regular expression and a specified string. 
    res.render('auth/signup', { errorMessage: 'Please provide your username, email AND password.' });
    return;
  }
  
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  
  try {
    const hash = await bcryptjs.hash(password, saltRounds);
    const newUser = await User.create({
      username, email, passwordHash: hash
    });
    res.redirect('/userProfile');
    console.log(`new user : ${newUser}`);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: e.message });
      } else if (e.code === 11000) {
        res.status(500).render('auth/signup', { errorMessage: 'Username and email need to be unique. Either username or email is already used.'});
      } else {
          next(e);
      }
  }  
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  console.log('SESSION =====> ', req.session);
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
  } catch (e) {
    next(e);
  }
});

function isLoggedIn(req, res, next){
    if(req.session.currentUser) next();
    else res.redirect('/login');
}

router.get('/userProfile', isLoggedIn, (req, res) => {
  res.render('users/profile', { userInSession: req.session.currentUser });
});


router.get('/private', isLoggedIn, (req, res) => {
    res.render('private/private', { userInSession: req.session.currentUser });
});

router.get('/main', isLoggedIn, (req, res) => {
    res.render('private/main', { userInSession: req.session.currentUser });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
