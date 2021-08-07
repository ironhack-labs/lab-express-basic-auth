const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res) => {
  res.render('auth/signup-form');
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDb) => {
      console.log('created a new User:', userFromDb);
      res.redirect('/');
    })
    .catch((err) => console.log('something didnt work: ', err));
});

router.get('/login', (req, res) => {
  res.render('auth/login-form');
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const plainPassword = req.body.password;
  User.findOne({ username: username }).then((userFromDb) => {
    const hash = userFromDb.passwordHash;
    const verifyPassword = bcryptjs.compareSync(plainPassword, hash);

    if (verifyPassword) {
      req.session.currentUser = userFromDb;
      res.redirect('/auth/user-space');
    } else {
      res.redirect('/login');
    }
  });
});


router.get('/auth/user-space', (req, res) => {
  const session = req.session;
  res.render('auth/logged-in',{userInSession:session})
});

module.exports = router;
