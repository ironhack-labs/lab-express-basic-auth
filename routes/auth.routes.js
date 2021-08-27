const router = require('express').Router();
const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
let userName;

// GET to show the form for signing user in
router.get(`/signup`, (req, res, next) => {
  res.render('auth/user-signin');
});

//POST to sign in the user and make a recod in DB
router.post(`/signup`, (req, res, next) => {
  const { username, email, password } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      bcryptjs.hash(password, salt).then((passwordHash) => {
        User.findOne({ $or: [{ username: username }, { email: email }] }).then(
          (user) => {
            if (!user) {
              User.create({ username, email, passwordHash }).then(
                (createdUser) => {
                  console.log(`CRETAED USER: ${createdUser}`);
                  userName = createdUser.username;
                  res.redirect('/auth/userProfile');
                }
              );
            } else {
              res.render('auth/user-login');
            }
          }
        );
      });
    })
    .catch((err) => {
      console.log(`Soemthing ent wrong during signing in ${err}`);
      next(err);
    });
});

//GET to render user's home page / profile page
router.get(`/userProfile`, (req, res) => {
  const currentUserName = userName[0].toUpperCase() + userName.slice(1);
  res.render('users/user-profile', { currentUserName });
});

//GET to render login form
router.get(`/login`, (req, res) => {
  res.render(`auth/user-login`);
});

//POST to login and validate user's credentials
router.post('/login', (req, res, next) => {
  const { username, email, password } = req.body;
  User.findOne({ username: username })
    .then((foundUser) => {
      if (foundUser) {
        bcryptjs.compare(password, foundUser.passwordHash).then((isMatch) => {
          if (isMatch) {
            console.log(`Password mathes: ${isMatch}`);
            userName = foundUser.username;
            console.log('USERNAME FROM LOGIN AUTH: ' + userName);
            res.redirect('/auth/userProfile');
          } else {
            console.log(`Password does not match...`);
            res.redirect('/auth/login');
          }
        });
      } else {
        res.redirect('/auth/signup');
      }
    })
    .catch((err) => {
      console.log(
        `Somwthing went wrong during validating the credentials ${err}`
      );
      res.redirect('/auth/login');
    });
});

module.exports = router;
