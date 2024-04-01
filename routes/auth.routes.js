// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();




const User = require('../models/User.model');


// auth.routes.js
const mongoose = require('mongoose'); // <== has to be added
// ... other imports and get route stay untouched



// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
//router.post('/signup', (req, res, next) => {
   // console.log('The form data: ', req.body);
  //});



// the get route skipped
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    // console.log("The form data: ", req.body);
   
    const { username, email, password } = req.body;

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
      })
      .then(userFromDB => {
        // console.log('Newly created user is: ', userFromDB);
        res.redirect('/userProfile');
      })
      
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
   
          console.log(" Username and email need to be unique. Either username or email is already used. ");
   
          res.status(500).render('auth/signup', {
             errorMessage: 'User not found and/or incorrect password.'
          });
        } else {
          next(error);
        }
      });
  });

// routes/auth.routes.js
// ... imports and get route stay untouched

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;

  // make sure users fill all mandatory fields:
  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  // ... the rest of the code stays unchanged
});


app.get('/login', (req, res) => {
    res.render('login'); // Render your login form view
  });
  
  // Handle login form submission
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Check credentials and authenticate user
    // If authentication successful, store user information in session
    req.session.user = { email }; // Example: Storing email in session
    res.redirect('/dashboard'); // Redirect to dashboard or any other authenticated route
  });
  
module.exports = router;