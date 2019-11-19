var express = require('express');
const zxcvbn = require('zxcvbn');
const User = require('./../models/User');
var router = express.Router();

const bcrypt = require('bcrypt');
// 1 - Specify how many salt rounds
const saltRounds = 10;

// POST '/auth/signup'
router.post('/signup', (req, res, next) => {
  // 2 - Destructure the password and username
  const { username, password } = req.body;

  // 3 - Check if the username and password are empty strings
  if (username === '' || password === '') {
    res.render('auth-views/signup', {
      errorMessage: 'Provide username and password.',
    });
    return;
}

User.findOne({ username })
    .then(user => {
      // > If username exists already send the error
      if (user) {
        res.render('auth-views/signup', {
          errorMessage: 'Username already exists.',
        });
        return;
      }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    User.create({username, password: hashedPassword })
      .then(newUserObj => {
          res.redirect('/')
      })
      .catch(err => {
        res.render('auth-views/signup', {
          errorMessage: 'Error while creating new username.',
        });
      });
    })
    .catch(err => console.log(err));
});


router.post('/login', (req, res, next) => {
    // 2 - Destructure the password and username
    const { username, password: enteredPassword } = req.body;
  
    // 3 - Check if the username and password are empty strings
    if (username === '' || enteredPassword === '') {
      res.render('auth-views/login', {
        errorMessage: 'Provide username and password.',
      });
      return;
  }

    User.findOne({username})
        .then(userData => {
          if (!userData) {
              res.render('auth-views/login', {errorMessage: "User not found:("})
          }

    const hashedPasswordFromDB = userData.password;

    const correctPassword = bcrypt.compareSync(
        enteredPassword,
        hashedPasswordFromDB
    );

    if(correctPassword) {
        req.session.currentUser = userData;
        res.redirect('/')
    }
})
    .catch(err => console.log(err));
});


 module.exports = router;