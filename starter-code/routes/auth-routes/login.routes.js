const express = require('express');
const router = express.Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//Login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

//
//login response
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { err: "The username doesn't exist" });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', {
          err: 'Incorrect password',
        });
        return;
      }
    })
    .catch(err => console.log(`Error in DB while searching user: ${err}`));
});

//Register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

//post register
router.post('/register', (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const thePassword = bcrypt.hashSync(password, salt);
  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render('auth/register', {
          err: 'The user already exists!',
        });
        return;
      }

      User.create({
        firstName,
        lastName,
        username,
        password: thePassword,
      })
        .then(usersFromDB => {
          // console.log('usersFromDB: ', usersFromDB);
          res.redirect('/login');
        })
        .catch(err => console.log(`Error while creating user: ${err}`));
    })
    .catch(err => console.log(`Error while searching user in DB: ${err}`));
});

module.exports = router;
