const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.register = ((req, res, next) => {
  res.render('auth/register.hbs')
})

module.exports.doRegister = ((req, res, next) => {

  function renderWithErrors(errors) {
    res.render('auth/register', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        renderWithErrors({ username: 'username already registered'})
      } else {
        user = new User(req.body);
        return user.save()
          .then(user => res.redirect('/login'))
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors)
      } else {
        next(error);
      }
    });
})

module.exports.login = ((req, res, next) => {
  res.render('auth/login.hbs')
})

module.exports.doLogin = ((req, res, next) => {
  res.render('auth/login.hbs')
})