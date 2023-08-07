const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')

const saltRounds = 10

router.get('/sign-up', isLoggedOut, (req, res) => {
  res.render('auth/signup')
})

router.post('/sign-up', isLoggedOut, (req, res, next) => {
  const { username, nonEncryptedPassword } = req.body

  if (!username.length || !nonEncryptedPassword.length) {
    res.render('auth/signup', { errorMessage: 'Fill all the fields' })
    return
  }

  User.findOne({ username }).then(foundUser => {
    if (foundUser) {
      res.render('auth/signup', { errorMessage: 'Username alredy taken' })
      return
    }
  })

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(nonEncryptedPassword, salt))
    .then(hash => User.create({ username, password: hash }))
    .then(() => res.redirect('/log-in'))
    .catch(err => next(err))
})

router.get('/log-in', isLoggedOut, (req, res) => {
  res.render('auth/login')
})

router.post('/log-in', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body

  if (!username.length || !password.length) {
    res.render('auth/login', { errorMessage: 'Fill all the fields' })
    return
  }

  User.findOne({ username })
    .then(foundUser => {
      if (!foundUser) {
        res.render('auth/login', { errorMessage: 'User not found' })
        return
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        res.render('auth/login', { errorMessage: 'Incorrect password' })
        return
      }

      req.session.currentUser = foundUser
      res.redirect('/')
    })
    .catch(err => next(err))
})

router.get('/log-out', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

module.exports = router
