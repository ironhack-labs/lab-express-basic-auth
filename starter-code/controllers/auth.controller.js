const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.signupForm = (req, res, next) => {
  res.render('main/signup');
}

module.exports.signupRegister = (req, res, next) => {

  function renderWithValidationErrors(errors) {
    res.render('main/signup', {
      userName: req.body,
      errors: errors
    })
  }

  User.findOne({userName: req.body.name})
    .then(user => {
      if(user) {
        renderWithValidationErrors({userName: 'User Name is not available'})
      } else {
        const user = new User ({
          userName: req.body.name,
          password: req.body.password
        })
        return user.save()
          .then(user => res.redirect('/login'))
      }
    })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      renderWithValidationErrors(error.errors)
    } else {
      next(error);
    }
  });
}

module.exports.loginForm = (req, res, next) => {
  res.render('main/login');
}