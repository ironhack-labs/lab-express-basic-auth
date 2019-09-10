const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/signup', (req, res, next) => {
  res.render('signup', { registered: false })
})

router.post('/signup', async (req, res, next) => {
  const salt = await bcrypt.genSaltSync(7)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const user = await User.create({
    username: req.body.username,
    password: hashedPassword
  })
  res.render('signup', { registered: true, username: user.username })
})

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) {
    res.render('login', { err: "User doesn't exist" })
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.loggedUser = user
    req.app.locals.loggedUser = user
    res.redirect('/main')
  } else {
    res.render('login', { err: 'Incorrect user' })
  }
})

let userLogged = (req, res, next) => {
  if (req.session.loggedUser) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/main', userLogged, (req, res, next) => {
  res.render('main')
})

router.get('/private', userLogged, (req, res, next) => {
  res.render('private')
})

module.exports = router
