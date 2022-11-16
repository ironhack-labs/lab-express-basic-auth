const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');

// ---ROUTES---

// GET SIGNUP route ==> to display the signup form to users
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

// POST SIGNUP route ==> to process form data
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        // username: username, email: email
        username,
        email,
        password: hashedPassword
      });
    })
    .then(user => {
      res.redirect(`/userProfile`);
    })
    .catch(error => {
      //Handle validation error coming from mongoose
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      //Handle duplication error coming from MongoDB
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    });

});

// GET USER PROFILE ==> to display the profile of a single user
router.get('/userProfile', isLoggedIn, (req, res) => {
  res.render('users/user-profile', { user: req.session.currentUser });
});

// ---LOGIN---

// GET LOGIN route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// POST LOGIN route ==> to display the login form to users
router.post('/login', (req, res, next) => {
  let { email, password } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({email})
  .then(user => {
    if (!user) {
      res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
      return;
    } else if (bcryptjs.compareSync(password, user.password)) {
      res.redirect('/userProfile');
      console.log(`From POST login, req.session.currentUser is: ${req.session.currentUser}`)
    } else {
      res.render('auth/login', { errorMessage: 'Incorrect password.' });
    }
  })
  .catch(error => next(error));
});

// POST LOGOUT route
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
})

module.exports = router;
