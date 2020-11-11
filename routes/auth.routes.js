const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Router, response, request} = require('express');
const User = require('../models/User.model');

const router = new Router();

const saltRounds = 10;

router.get('/signup', (request, response) => {
  response.render('auth/signup');
  
});

router.post('/signup', (request, response, next) => {
  const { username, email, password } = request.body;
  
  if (!username || !email || !password) {
    response.render('auth/signup', {
      errorMessage: 'All fields are mandatory, please provide username, email and password.'
    });
    return;
  };

  const emailFormatRegex = /^\S+@\S+\.\S+$/;

  if (!emailFormatRegex.test(email)) {
    response.render('auth/signup', {
      email,
      username,
      validationError: 'Please use a valid email address.',
    });
    return;
  }

  bcrypt.hash(password, saltRounds)
    .then((cryptedPassword) => {
      User.create({ username, email, passwordHash : cryptedPassword})
        .then((user) => {
          response.render('users/user-page', {user});
        })
        .catch((error) => {
          if (error.code === 11000) {
            response.render('auth/signup', {duplicatedError: 'This email or username is already being used, please, try again with a different one.'})
          }
        })
    })
    .catch((error) => console.error(`There is an error on the creation of the profile: ${error}`))

})

router.get('/login', (request, response) => {
  response.render('auth/login')
  
});

router.post('/login', (request, response, next) => {
  console.log('SESSION =====> ', request.session);
  const {email, password} = request.body;

  if (!password || !email) {
    response.render('auth/login', {errorMessage: 'All fields are mandatory, please introduce both email and password'})
    return;
  };

  User.findOne({email})
    .then((user) => {
      
      if (!user) {
        response.render('auth/login', {
          errorMessage: 'There is no account under this email, try again or create a new account.'
        })
        return;

      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        response.render('users/user-page', { user });
        request.session.user = user;
        
      } else {
        response.render('auth/login', {
          errorMessage: 'Incorrect password'
        })
      }
    })
})

/*router.get('/main', (request, response) => {
  if () {
    console.log('I tried')
    response.render('users/main');
  }
});*/

router.post("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/");
});

module.exports = router;