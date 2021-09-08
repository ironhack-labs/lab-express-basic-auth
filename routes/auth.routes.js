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

// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
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

  //Get route to dispkay the user-profile page
router.get('/userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;


module.exports = router;
