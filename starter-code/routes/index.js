const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
  const { userName, password } = req.body
  const salt = bcrypt.genSaltSync(7)
  const hashedPassword = bcrypt.hashSync(password, salt)
  const user = await User.create({ userName, password: hashedPassword })
  res.render('auth/login')
})

router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', async (req, res, next) => {
  const { userName, password } = req.body
  const user = await User.findOne({ userName })
  if (!user) {
    res.render('auth/login', { err: `User does not exist!!!` })
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.loggedUser = user
    req.app.locals.loggedUser = user
    res.redirect('/profile')
  } else {
    res.render('auth/login', { err: `The password is incorrect!` })
  }
})

function isLoggedIn(req, res, next) {
  if (req.session.loggedUser) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/profile', isLoggedIn, (req, res, next) => {
  const { loggedUser } = req.app.locals
  res.render('auth/profile', loggedUser)
})

router.get('/private', (req, res, next) => {
  const { loggedUser } = req.app.locals
  if (loggedUser) {
    res.render('private', loggedUser)
  } else {
    res.redirect('main')
  }
})

router.get('/main', (req, res, next) => {
  res.render('main')
})

module.exports = router
