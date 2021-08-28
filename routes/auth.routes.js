const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User.model');

const { isLoggedOut } = require('../middleware/route-guard');
const { getUserName } = require('../helpers/helpers');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// GET to show the form for signing user in
router.get(`/signup`, (req, res, next) => {
  res.render('auth/user-signin');
});

//POST to sign in the user and make a recod in
router.post(`/signup`, async (req, res, next) => {
  const { username, email, password } = req.body;
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!username || !email || !password) {
    res.status(200).render('auth/user-signin', {
      errorMessage:
        'All fields are mandatory. Please provide your username, email and password.',
    });
    return;
  }

  if (regex.test(password)) {
    try {
      const salt = await bcryptjs.genSalt(saltRounds);
      const passwordHash = await bcryptjs.hash(password, salt);
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      try {
        if (!user) {
          await User.create({ username, email, passwordHash });
          res.redirect('/user/userprofile');
        } else {
          res.render('auth/user-login');
        }
      } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
          res
            .status(500)
            .render('auth/user-login', { errorMessage: err.message });
        } else {
          next(err);
        }
      }
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/user-signin', {
          errorMessage: err.message,
        });
      } else {
        next(err);
      }
    }
  } else {
    res.render('index', {
      errorMessage:
        'The password should have at least 1 digit, 1 special character',
    });
  }
});

//GET to render login form
router.get(`/login`, (req, res) => {
  if (req.session?.user) {
    const userName = getUserName(req, res);
    res.render(`users/user-profile`, { userData: userName });
  } else {
    res.render(`auth/user-login`);
  }
});

//POST to login and validate user's credentials
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/user-login', {
      errorMessage: 'Please provide username and password',
    });
  }

  User.findOne({ username: username })
    .then((foundUser) => {
      if (foundUser) {
        bcryptjs
          .compare(password, foundUser.passwordHash)
          .then((isMatch) => {
            if (isMatch) {
              //creating a property of user and assiging the details of user gotten from DB
              req.session.user = foundUser;
              const userName = req.session.user.username;
              const currentUserName =
                userName[0].toUpperCase() + userName.slice(1);

              res.render('users/user-profile', { userData: currentUserName });
            } else {
              console.log(`Password does not match...`);
              res.redirect('/auth/login');
            }
          })
          .catch((err) =>
            console.log(
              `Smth went wrong duting comparing hashed passwords: ${err}`
            )
          );
      } else {
        res.redirect('/auth/signup');
      }
    })
    .catch((err) => {
      console.log(
        `Somewthing went wrong during validating the credentials ${err}`
      );
      res.redirect('/auth/login');
    });
});

module.exports = router;
