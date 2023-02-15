const router = require('express').Router()
const isAuthenticated = require('./../middlewares/isAuthenticated')
const exposeUsersToView = require('./../middlewares/exposeUserToView')
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')

router.get('/', async (req, res, next) => {
  try {
    res.render('auth/signup')
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  const { username, password } = req.body
  try {
    if (!username || !password) {
      return res.render('auth/signup', {
        errorMessage: 'Please fill out all of the fields!',
      })
    }
    if (password.length < 6) {
      return res.render('auth/signup', {
        errorMessage: 'Please put a longer password',
      })
    }
    const foundUser = await User.findOne({ username: username })
    if (foundUser) {
      return res.render('auth/signup', {
        errorMessage: 'Theres another one of you!',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userToCreate = {
      username,
      password: hashedPassword,
    }
    const userFromDb = await User.create(userToCreate)
    console.log(userFromDb)
    res.redirect('/login')
  } catch (error) {
    next(error)
  }
})

// I couldn't put a switch for "Log out" / "Log in"!!!
// I am not sure if everything is ok or not...

router.get('/profile', isAuthenticated, (req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUser = req.session.currentUser
    res.locals.isLoggedIn = true
    res.render('profile')
  }
  res.locals.isLoggedIn = false
})

module.exports = router
