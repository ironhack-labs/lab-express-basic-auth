const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

const saltRound = 10;

router.get('/signup', (_, res, next) => {
  res.status(200).render('auth/signup')
});


router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fiels are mandatory. Please provide your username and password' })
  }

  const passwordFormatRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!passwordFormatRegex.test(password)) {
    res.status(200).render("auth/signup", { errorMessage: "Passowrd needs to have at least 8 characters, 1 lowercase, 1 uppercase and 1 number" });
    return;
  }

  User
    .findOne({ username })
    .then(user => {

      const salt = bcrypt.genSaltSync(saltRound);
      const hashPassword = bcrypt.hashSync(password, salt);

      User
        .create({ username, password: hashPassword })
        .then((newUser) => {
          req.session.user = newUser;
          res.redirect("/profile");
        })
        .catch((createErr) => {
          console.error(`Error occured while creating: ${createErr}`);

          if (createErr.code === 11000) {
            res.status(400).render("auth/signup", {
              errorMessage: `This username already exists, try another one`,
            });
          } else {
            res.status(500).render("auth/signup", {
              errorMessage: "Oops, something went wrong with our server. Please try again",
            });
          }
        });
    })
    .catch((signupErr) => {
    console.error(`Error while creating new user: ${signupErr}`)
  })
});
router.get('/profile', (req, res) => {
  const { user } = req.session;
  res.status(200).render("auth/profile", user);
});

router.get('/login', (_, res) => {
  res.status(200).render('auth/login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/login', { errorMessage: 'All fiels are mandatory. Please provide your username and password' })
  }
  User
    .findOne({ username })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(200).render('auth/login', { errorMessage: `This username doesn't exist` });
        return;
      }

      bcrypt
        .compare(password, foundUser.password)
        .then(verifiedStatus => {

          if (verifiedStatus) {
            req.session.user = foundUser;
            res.redirect('/profile');
          } else {
            res.status(200).render('auth/login', { errorMessage: 'The password is incorrect!' });
          }

        })
        .catch((bcryptErr) => {
          console.error(`Error while comparing: ${bcryptErr}`);
          next();
        })
    })
    .catch((findErr) => {
      console.log(`Error when finding: ${findErr}`);
      next(findErr);
    })
    
});


router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;