const mongoose = require('mongoose');
const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// display signup form to the user 
router.get('/signup', (req, res) => res.render('auth/signup'))

// process data from the form
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
   
    if (!username || !password) {
      res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide username and password.' });
      return;
    }

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
        console.log('Newly created user is: ', userFromDB);
        res.redirect('/userProfile');
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username and email need to be unique. Either username or email is already used.'
          });
        } else {
          next(error);
        }
      }); 
});



// display login form
router.get('/login', (req, res) => res.render('auth/login'));



// process data from the form
router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter username and password.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Username is not registered.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});




// log out
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});




// show new page
router.get('/userProfile', (req, res) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

// show main page
router.get('/main', (req, res) => {
  if (req.session.currentUser) {
    res.render('users/main')
  } else {
    res.redirect('/')
  }
})

// show private page
router.get('/private', (req, res) => {
  if (req.session.currentUser) {
    res.render('users/private')
  } else {
    res.redirect('/')
  }
});

module.exports = router;