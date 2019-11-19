var express = require('express');
// const zxcvbn = require('zxcvbn');
const User = require('./../models/User');
var router = express.Router();

// 0 - Require bcrypt
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

  // 4 - Check if the username already exists - if so send error
User.findOne({ username })
  .then(user => {
    // > If username exists already send the error
    if (user) {
      res.render('auth-views/signup', {
        errorMessage: 'Username already exists.',
      });
      return;
    }

    // > If username doesn't exist, generate salts and hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // > Create the user in the DB
    User.create({ username, password: hashedPassword })
      .then(newUserObj => {
        res.redirect('/');
      })
      .catch(err => {
        res.render('auth-views/signup', {
          errorMessage: 'Error while creating new username.',
        });
      });

    // > Once the user is created , redirect to home
  })
  .catch(err => console.log(err));
});



module.exports = router;