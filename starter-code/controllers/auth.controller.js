const User = require('../models/user.model');
const mongoose = require('mongoose');

module.exports.register = (req, res, next) => {
  res.render('auth/register');
}

module.exports.doRegister = (req, rest, next) => {
  User.findOne({ email: req.body.email})
  .then(user => {
    if (user) {
      res.render('auth/register', {
        user: req.body,
        errors: {
          email: 'Email already registered'
        }
      })
    }
  })
}