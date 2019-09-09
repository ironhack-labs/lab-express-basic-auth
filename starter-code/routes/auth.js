const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

router.get('/signup', (req, res) => {
  res.render('sign-up')
})

router.post('/signup', (req, res) => {
  let { username, password } = req.body
  if (!password) return res.render('sign-up', { err: 'no has ingresado un password' })
  if (!username) return res.render('sign-up', { err: 'no has ingresado un usuario' })
  const salt = 10
  const bsalt = bcrypt.genSaltSync(salt)
  password = bcrypt.hashSync(password, bsalt)
  console.log(password)
  User.create({ username, password })
    .then(user => {
      res.redirect('/auth/login')
    })
    .catch(err => {
      res.json(err)
    })
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  let { username, password } = req.body
  User.findOne({ username }).then(user => {
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user
      res.redirect('/')
    } else {
      res.render('login', {
        errorMessage: 'Password o Usuario incorrecto'
      })
    }
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/auth/login')
  })
})

module.exports = router
