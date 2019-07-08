const express = require('express');

const router = express.Router();
const bcrypt         = require("bcrypt");
const userModel = require('../models/user');
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// sign up
router.get('/signup', (req, res, next) => {
  res.render('sign-up');
});

router.post('/signup', (req, res, next) => {
  const {username} = req.body;
  const {password} = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    res.render('sign-up', {
      errorMessage: 'Indicate a username and a password to sign up',
    });
    return;
  }

  userModel.findOne({ 'username': username })
    .then((user) => {
      if (user !== null) {
        res.render('sign-up', {
          errorMessage: 'the username already exists!',
        });
        return;
      }

      userModel.create({
        username,
        password: hashPass,
      })
        .then(() => {
          res.redirect('/');
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});

// login
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === '' || thePassword === '') {
    res.render('login', {
      errorMessage: 'Please enter both, username and password to sign up.',
    });
    return;
  }

  userModel.findOne({ username: theUsername })
    .then((user) => {
      if (!user) {
        res.render('login', {
          errorMessage: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/main');
      } else {
        res.render('login', {
          errorMessage: 'Incorrect password',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// secret page
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect('/login');         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
