var express = require('express');
const router = express.Router();

const User = require("./../models/UsersModel");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// GET '/signup'
router.get('/', (req, res, next) => {
  res.render('signup');
});


// POST '/signup'
router.post('/', (req, res, next) => {

  console.log("holadfbkvdfkvdknfjv");
  // 2 - Destructure the password and username
  const { username, password } = req.body;

  // 3 - Check if the username and password are empty strings
  if (username === '' || password === '') {
    res.render('signup', {
      errorMessage: 'Provide username and password.',
    });
    return;
  }

  // 4 - Check if the username already exists - if so send error

  User.findOne({ username })
    .then(user => {
      // > If username exists already send the error
      if (user) {
        res.render('signup', {
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
          res.render('signup', {
            errorMessage: 'Error while creating new username.',
          });
        });

      // > Once the user is cretaed , redirect to home
    })
    .catch(err => console.log(err));
});


module.exports = router;