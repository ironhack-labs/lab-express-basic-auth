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
      email, 
      username,
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
          request.session.user = user;
          response.redirect('/user-page');
          //response.redirect('users/user-page',);
        })
        .catch((error) => {
          if (error.code === 11000) {
            response.render('auth/signup', {
              email, 
              username,
              duplicatedError: 'This email or username is already being used, please, try again with a different one.'
            })
          }
        })
    })
    .catch((error) => console.error(`There is an error on the creation of the profile: ${error}`))

})

router.get("/user-page", (request, response) => {
  response.render("users/user-page", { user: request.session.user });
});

router.get('/login', (request, response) => {
  response.render('auth/login')
  
});

router.post('/login', (request, response, next) => {
  console.log('SESSION =====> ', request.session);
  const {email, password} = request.body;

  if (!password || !email) {
    response.render('auth/login', {
      email,
      errorMessage: 'All fields are mandatory, please introduce both email and password'
    })
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
        request.session.user = user;
        response.redirect('/user-page');
        
        
      } else {
        response.render('auth/login', {
          errorMessage: 'Incorrect password'
        })
      }
    })
    .catch((error) => next(error));
})

router.get('/main', (request, response) => {
  if (request.session.user) {
    response.render('users/main');
  } else {
    response.redirect('/login')
  }
});

router.get('/private', (request, response) => {
  if (request.session.user) {
    response.render('users/private');
  } else {
    response.redirect('/login')
  }
});

router.post("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/login");
});

module.exports = router;