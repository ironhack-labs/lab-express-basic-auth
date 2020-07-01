const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render('signuppage')
});

router.get('/login', (req, res) => {
    res.render('loginuser');
  });

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    //
    if (password.length < 5) {
        res.render('signuppage', { message: 'Your password should have 5 characters minimum' });
        return;
    }
    if (username === '') {
        res.render('signuppage', { message: 'Username must be with a name' });
        return;
    }
    // check if user is in the database
    User.findOne({ username: username }).then(userFromDB => {
        if (userFromDB !== null) {
            res.render('signuppage', { message: 'We are sorry, Username is taken!"' });
        } else {
            // we create the user and add the hashed password
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt)
            User.create({ username: username, password: hash })
                .then(userDB => {
                    // log the user in by saving it in the session
                    req.session.user = userDB;
                    res.redirect('/profile')
                })
                .catch(err => {
                    next(err);
                })
        }
    })
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 5) {
      res.render('loginuser', { message: 'Your password should have 5 characters minimum' });
      return;
    }
    if (username === '') {
      res.render('loginuser', { message: 'Username must be with a name' });
      return;
    }
    // check if we have a user with the username from the input in our database
    User.findOne({ username: username }).then(userFromDB => {
      if (userFromDB === null) {
        res.render('loginuser', { message: 'Invalid credentials' });
        return;
      }
      // check if the passwords match
      if (bcrypt.compareSync(password, userFromDB.password)) {
        // password and the hash match
        req.session.user = userFromDB;
        res.redirect('/profile');
      } else {
        // the password from the input and the password from the database don't match
        res.render('login', { message: 'Invalid credentials' });
      }
    })
  });

module.exports = router;