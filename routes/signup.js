const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.model')

/* GET home page */
router.get('/signup', (req, res, next) => res.render('signup'));
router.post('/signup', (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  if (password.length < 8) {
    res.render('signup', {
      message: 'password must have at least 8 chars'
    })
    return
  }
  if (username === '') {
    res.render('signup', {
      message: 'username cannot be empty'
    })
    return
  }
  User.findOne({
    username: username
  }).then(userFromDb => {
    if (userFromDb !== null) {
      res.render('signup', {
        message: 'Your username is already taken'

      })
      return
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt)
      User.create({
        username: username,
        password: hash
      }).then(signedUpUser => {
        res.redirect('/')
        return
      })
    }
  })
})
module.exports = router;