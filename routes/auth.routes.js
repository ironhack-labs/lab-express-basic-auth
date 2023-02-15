const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')

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

router.get('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error)
    }
    res.redirect('/login')
  })
})

module.exports = router
