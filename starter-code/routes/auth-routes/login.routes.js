const express = require('express');
const router = express.Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const salt = 10;

//Login
router.get('/login', (req, res) => {
  res.render('auth/login');
});

//

//Register
router.get('/register', (req, res) => {
  res.render('auth/register');
});

//
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  const thePassword = await bcrypt.hash(password, salt);
  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render('auth/register', {
          errMsg: 'The user already exists!',
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
          console.log('usersFromDB: ', usersFromDB);
          res.redirect('/');
        })
        .catch(err => console.log(`Error while creating user ${err}`));
    })
    .catch(err => console.log(`Error while searching user in DB ${err}`));
});

module.exports = router;
