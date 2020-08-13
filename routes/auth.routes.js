//Iteration 1. Sign up.

//1.4 Setting up Express Router, User, mongoose and bcrypt as we need to access to them from this file
const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;


// .get() route ==> to display the signup.hbs file form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
// .post() route ==> to send data input from the users on the form
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
      return
    }
  
    // setting password restrictions: 6 charts, 1uppercase, 1 lowercase, 1 number
    
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
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword
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
    }); // close .catch()
});



    module.exports = router;