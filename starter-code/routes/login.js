const express = require('express')
const router = express.Router()

/* GET home page. */

const bcrypt = require('bcrypt')

const User = require('../models/user')

/* render the login form. */
router.get('/', (req, res, next) => {
  res.render('login')
})

/* handle the POST from the login form. */
router.post('/', (req, res, next) => {
  var username = req.body.username
  var password = req.body.password

  if (username === '' || password === '') {
    const data = {
      title: 'Login',
      message: 'Indicate a username and a password to sign in'
    }
    return res.render('login', data)
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      }
      return res.render('login', data)
    }

    if (bcrypt.compareSync(password, user.password)) {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      }
      res.render('index', data)
    }
  })
})

module.exports = router
