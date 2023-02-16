const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const isAuthenticated = require('./../middlewares/isAuthenticated')
const exposeUsersToView = require('./../middlewares/exposeUserToView')

router.get('/', async (req, res, next) => {
  res.render('auth/login')
})

router.post('/', async (req, res, next) => {
  const { username, password } = req.body
  try {
    if (!username || !password) {
      return res.render('auth/login', {
        errorMessage: 'Please fill out all of the fields!',
      })
    }

    const foundUser = await User.findOne(
      { username },
      { password: 1, username: 1 }
    )
    if (!foundUser) {
      return res.render('auth/login', {
        errorMessage: 'Please sign up first!',
      })
    }
    const matchingPass = await bcrypt.compare(password, foundUser.password)
    if (!matchingPass) {
      return res.render('auth/login', {
        errorMessage: 'Invalid credentials!',
      })
    }
    req.session.currentUser = foundUser
    res.render('profile', { foundUser })
  } catch (error) {
    next(error)
  }
})

// I couldn't put a switch for "Log out" / "Log in"!!!
// I am not sure if everything is ok or

router.get('/profile', isAuthenticated, (req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUser = req.session.currentUser
    res.locals.isLoggedIn = true
    res.render('profile')
  }
  res.locals.isLoggedIn = false
})

router.get('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error)
    }
    res.redirect('/login')
  })
})

module.exports = router
