const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { genSaltSync, hashSync, compareSync } = require('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => {
  res.redirect('/signup')
})

// Sign up
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})
router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body
  const salt = genSaltSync(5)
  const hashedPassword = hashSync(password, salt)
  await User.create({ username, password: hashedPassword })
  res.redirect('/login')
})

// Login
router.get('/login', (req, res, next) => {
  res.render('auth/login')
})
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  console.log(user)
  if (!user) {
    res.render('auth/login', { err: "User doesn't exist" })
  }
  if (compareSync(password, user.password)) {
    req.session.loggedUser = user
    req.app.locals.loggedUser = user
    res.redirect('/main')
  } else {
    res.render('auth/login', { err: 'Me quieres ver la cara de estúpida??? 🙄' })
  }
  res.render('auth/login')
})

// Private routes
router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('main')
})
router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private')
})

function isLoggedIn(req, res, next) {
  if (req.session.loggedUser) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports = router
