
const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose'); 
const router = new Router();


const saltRounds = 10;

router.get('/userProfile', (req, res) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
   
  const { username, password } = req.body;

  //validation of username and password is filled
  if (!username || !password) {
  res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, and password.' });
  return;
  }

   // make sure passwords are strong:
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
      username,   
      passwordHash: hashedPassword
  });
  })
    .then(userFromDB => {
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
      //console.log(error);
      res.status(500).render('auth/signup', {
      errorMessage: 'Username need to be unique. This username is alredy in use'
    });
      } else {
        next(error);
      }
        });
    })

    // GET route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
  //console.log('SESSION =====> ', req.session);
  //console.log("The form data: ", req.body);
  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User.findOne({ username }) // <== check if there's user with the provided username
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'username is not registered. Try with other username.' });// <== if there's no user with provided username, notify the user who is trying to login
        return;

      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });
 
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});
        
    

module.exports = router;
