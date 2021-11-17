const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  if (username.length === 0) {
    res.render('signup', { message: 'You must provide a username!' })
    return
  }
  if (password.length === 0) {
    res.render('signup', { message: 'You must provide a password!' })
    return
  }
  if (password.length < 8) {
    res.render('signup', { message: 'Your password is too short!' })
  }

  User.findOne({ username: username }).then((userFromDB) => {
    if (userFromDB !== null) {
      res.render('signup', { message: 'Your username is already taken' })
    } else {
      const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(password, salt)

      User.create({ username: username, password: hash })
        .then((createdUser) => {
          console.log(createdUser)
          res.redirect('/login')
        })
        .catch((err) => next(err))
    }
  })
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body

  User.findOne({ username: username }).then((userFromDB) => {
    if (userFromDB === null) {
      res.render('login', { message: 'invalid credentials' })
      return
    }

    if (bcrypt.compareSync(password, userFromDB.password)) {
      req.session.user = userFromDB
      res.redirect('/profile')
    } else {
      res.render('login', { message: 'invalid credentials' })
    }
  })
})

module.exports = router
