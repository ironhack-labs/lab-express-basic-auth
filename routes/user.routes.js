const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const isAuthenticated = require('../middlewares/isAuthenticated')
const exposeUsersToView = require('./../middlewares/exposeUserToView')

router.get('/profile', isAuthenticated, exposeUsersToView, (req, res, next) => {
  res.render('profile')
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
