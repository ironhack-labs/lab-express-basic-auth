// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

//we set the bcryptjs
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

//Require user model to be able to save users in the DB
const User = require('../models/User.model');

//require mongoose for FORM VALIDATION
const mongoose = require('mongoose');

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// GET route ==> to display the signup form to users
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    // console.log('The form data: ', req.body);
    const {username, email, password} = req.body;
    if (!username || !email || !password){
        res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please provide your username, email and password.'});
        return; //WHY
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
                username, //User model username is unique so it will ask for a different one each time
                email, // same above
                passwordHash: hashedPassword
                // console.log(`Password hash: ${hashedPassword}`);
            });
        })
        .then(userFromDB=>{
            // console.log(`Newly created user is: `, userFromDB)
            res.redirect(`/userProfile`)
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
  //////////// L O G I N ///////////
 
// GET login route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    //destructuring
    const { email, password } = req.body;
   //email and password validation
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
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

  //Get route to display the user-profile page
  router.get('/userProfile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });
  router.get('/main', isLoggedIn, (req, res) => {
    res.render('users/main', { userInSession: req.session.currentUser });
  });
  router.get('/private', isLoggedIn, (req, res) => {
    res.render('users/private', { userInSession: req.session.currentUser });
  });

////////////////LOG OUT///////////////////////
router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
    });


module.exports = router;
