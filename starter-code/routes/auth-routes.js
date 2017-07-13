const express = require('express');
const authRoutes = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const bcryptSalt = 10;

// /signup => Display the sign-up form
authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// Called on form submit
authRoutes.post('/signup', (req, res, next) => {
  // Retrieve th data from the form
  const username = req.body.username;
  const password = req.body.password;
  
  // check the data in the form
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please enter a username and a password to sign up"
    });
    return; // ASK THOR!!
  }
  
  // If the form data is correct, then try to see if the user does not exists already
  User.findOne({ username: username }, 'username', (err, user) =>{

    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "This username already exists"
      });
      return;
    }
  });

  // If the user does not exist, then create it  
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username: username,
    password: hashPass
  })

  newUser.save((err) => {
    if (err) { return next(err) }
    res.render('index', {
      title: 'Basic Auth',
      successMessage: "Your account have been created successfully!"
    });
  })

});

// /login route
authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});


// process login form data
authRoutes.post('/login', (req, res, next) => {
  // Retrieve the data from the form
  const username = req.body.username;
  const password = req.body.password;

  // Check the data was entered in the form
  if (username == '' || password == '') {
    return res.render('auth/login', {
      errorMessage: 'Please enter a username and a password to log in',
    })
  } 

  // find the user in db
  User.findOne( { username: username }, (err, user ) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "This username doesn't exist"
      });
      return;
    } 

    // Check the password is correct
    if ( bcrypt.compareSync( password, user.password ) ) {
      // Add the user to the browser session
      req.session.currentUser = user;

      // redirect to the login landing page
      res.redirect('/main');
    } else {
      res.render('auth/login', {
        errorMessage: 'Your password is incorrect password',
      })
    }
    
  })

});

module.exports = authRoutes;