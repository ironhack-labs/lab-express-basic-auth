const User = require('../models/User.model')
const mongoose = require('mongoose')

module.exports.login = (_, res) => {
  res.render('users/login')
}

module.exports.signup = (_, res) => {
  res.render('users/signup', { user: new User() })
}

module.exports.create = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  user
    .save()
    .then((user) => {
      res.redirect('/')
    })
    .catch((error) => {
      res.render('users/signup', { user, error: error.errors })
    })
}
