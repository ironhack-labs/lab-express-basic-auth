const express = require('express');
const router = express.Router();

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10
const { isLoggedOut } = require('../middleware/route-guard');

// Signup 
router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res) => {
  const { username, password } = req.body
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => {
      return bcryptjs.hash(password, salt)
    })
    .then(password => {
      return User.create({ username, password })
    })
    .then(() => res.redirect('/login'))
    .catch(err => console.log(err))
})

// Login
router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login')
})

router.post('/login', (req, res) => {
  const { username, password } = req.body

  User
    .findOne({ username })
    .then(user => {
      console.log(username)
      console.log(password)

      if (!user) {
        res.render('auth/login', { errorMessage: 'Unrecognized username' })
        return
      }
      if (bcryptjs.compareSync(password, user.password) === false) {
        res.render('auth/login', { errorMessage: 'Incorrect password' })
        return
      }
      req.session.currentUser = user
      res.redirect('/private')
    })
    .catch(err => console.log(err))
})


// Log out
router.get('/close-sesion', (req, res) => {
  req.session.destroy(() => res.redirect('/login'))
})




module.exports = router