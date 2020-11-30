const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Route to singup page
router.get('/signup', (req, res) => res.render('auth/signup'));
 
// Route for posting singup
router.post('/signup', (req, res, next) => {
    const {firstname, lastname, email, password} = req.body;

    if (!firstname || !lastname || !email || !password) {
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

    bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            firstname,
            lastname,
            email,
            passwordHash: hashedPassword
        });
    })
    .then(userFromDB => {
        console.log(`Newly created user is: `, userFromDB);
        res.redirect('/userProfile');
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username need to be unique. Username is already used.'
          });
        } else {
          next(error);
        }
      });
  });

// Route to user profile
router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });

// Route to login page
router.get('/login', (req, res) => res.render('auth/login'));

// Route to check for login/post
router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    const { email, password } = req.body;
   
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
          return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user;
            res.redirect('/userProfile');
        } else {
          res.render('auth/login', { userDetails: {email, password}, errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

// Route to logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
  
// Route to private page
router.get('/private', (req, res) => {
    res.render('auth/private', { userInSession: req.session.currentUser });
});

// Route to main page
router.get('/main', (req, res) => {
    res.render('auth/main', { userInSession: req.session.currentUser });
});
 
module.exports = router;

// res.render login >>
// auth/login: {userDetails: {email, password}}