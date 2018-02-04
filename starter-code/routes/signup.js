const express = require('express')
const router = express.Router()

/* GET home page. */

const bcrypt = require('bcrypt')

const User = require('../models/user')

const bcryptSalt = 10

/* render the signup form. */
router.get('/', (req, res, next) => {
  res.render('signup')
})

/* handle the POST from the signup form. */
router.post('/', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  // validate
  if (username === '' || password === '') {
    const data = {

      message: 'Try again'
    }
    return res.render('signup', data)
  }

  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err)
    }
    if (user) {
      const data = {

        message: 'The "' + username + '" username is taken'
      }
      return res.render('signup', data)
    }
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      password: hashPass
    })

    newUser.save((err) => {
      if (err) {
        return next(err)
      }
    })
  })
})

/* handle the POST from the logout button. */
router.post('/logout', (req, res, next) => {
  res.redirect('/')
})

module.exports = router
