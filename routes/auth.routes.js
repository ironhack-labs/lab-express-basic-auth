const express = require("express");
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const salt = 10;

const userShouldNotBeAuth = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/'); 
  }
  next(); 
}

router.get('/login', userShouldNotBeAuth, (req, res, next) => {
  res.render('auth/login');
})

router.post('/login', userShouldNotBeAuth, (req, res, next) => {
  const { username, password } = req.body; 

  if (username.length < 5) {
    return res.render('auth/login', {
      errorMessage: 'Your username should be at least 5 characters long.'
    })
  }

  if (password.length < 8) {
    return res.render('auth/login', {
      errorMessage: 'Your password should be at least 8 characters long.'
    })
  }

  User.findOne({ username }).then(user => {
    if (!user) {
      return res.render('auth/login', {
        errorMessage: 'The username you entered does not exist.'
      })
    }

    bcrypt.compare(password, user.password).then(isSamePassword => {
      if (!isSamePassword) {
        return res.render('auth/login', {
          errorMessage: 'Wrong password!'
        })
      }

      req.session.user = user;
      res.redirect('/'); 
    })
  })

})

router.get('/signup', userShouldNotBeAuth, (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', userShouldNotBeAuth, (req, res) => {
  const { username, password } = req.body; 

  if (username.length < 5) {
    return res.render('auth/signup', {
      errorMessage: 'Your username should be at least 5 characters long.'
    })
  }

  if (password.length < 8) {
    return res.render('auth/signup', {
      errorMessage: 'Your password should be at least 8 characters long.'
    })
  }

  User.findOne({ username }).then(foundUser => {

    if (foundUser) {
      console.log('a user was found:', foundUser);
      return res.render('auth/signup', {
        errorMessage: 'This username is already taken.'
      })
    }

    bcrypt
      .genSalt(salt)
      .then(generatedSalt => {
        return bcrypt.hash(password, generatedSalt);
      })
      .then(hashedPassword => {
        return User.create({
          username,
          password: hashedPassword
        });
      })
      .then(createdUser => {
        console.log('a user was created:', createdUser);
        res.redirect('login'); 
      })

  })
  .catch(err => {
    console.log('error:', error); 
    res.render('auth/signup', { 
      errorMessage: err.message
    });
  })

})

const userShouldBeAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/signup'); 
  }
  next(); 
}

router.get('/logout', userShouldBeAuth, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('err destroying the session:', err); 
    }
    res.redirect('/');
  })
})

module.exports = router;