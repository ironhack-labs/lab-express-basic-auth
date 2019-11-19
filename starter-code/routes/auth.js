// HERE I JUST HANDLE THE SIGNUP AND LOGIN FORMS
var express = require('express');
const router = express.Router();

const User = require('./../models/User');

// - Require bcrypt
const bcrypt = require('bcrypt');
// - Specify how many salt rounds
const saltRounds = 10;

// POST 'auth/signup'
router.post('/signup', (req, res, next) => {
  // 1: Destructure username and password
  const {username, password} = req.body;

  // 2: Check that username and password are not empty strings
  if (username === '' || password === '') {
    res.render('auth-views/signup', {errorMessage: 'Provide valid username and password!'});
    return; // return to go out of the function
  }

  // 3: If username it's ok
  User.findOne({username})
    .then( (user) => {
      // > if username already exists, then send error
      if(user) {
        res.render('auth-views/signup', {errorMessage: 'Username already exists!'});
        return;
      }

      // > if doesn't exist, generate salts and hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // > once password has been encrypted, we add user to db
      User.create({username, password: hashedPassword})
        .then((newUser) => {
          // > User created successfuly, redirect to home page
          console.log('User added successfully');  
          res.redirect('/');
        })
        .catch(err => {
          res.render('auth-views/signup', {errorMessage: 'Error while creating new user'});
        });
    })
    .catch( (err) => console.log(err));
});

// POST 'auth/login'
router.post('/login', (req, res, next) => {
  // 1: Deconstruct username and password
  const {username, password: enteredPassword} = req.body;

  // 2: Check if username or pswd are empty strings
  if (username === '' || enteredPassword === '') {
    res.render('auth-views/login', {errorMessage: 'Provide valid username and password!'});
    return;
  }

  // 3: If it is valid, then find it in the databse
  User.findOne({username})
    .then((user) => {
      // > if username doesn't exist
      if(!user) {
        res.render('auth-views/login', { errorMessage: 'Invalid username!' });
        return;
      }

      // > if username exists - check if the password is correct
      const hashedPasswordFromDB = user.password; // Hashed password saved in DB during signup

      // compare if enetered password is the correct one
      const passwordCorrect = bcrypt.compareSync(
        enteredPassword,
        hashedPasswordFromDB,
      );

      // If password is correct - create session (& cookie) and redirect
      if (passwordCorrect) {
        // Save the login in the session ( and create cookie )
        // And redirect the user
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth-views/login', { errorMessage: 'Invalid password!' });
        return;
      }

      // Else - if password incorrect - return error
    })
    .catch(err => console.log(err));
})

module.exports = router;