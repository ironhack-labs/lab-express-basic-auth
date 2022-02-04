const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.register = (req, res, next) =>  {
    res.render('auth/register')
}

module.exports.doRegister = (req, res, next) => {
    const user = { username, email, password } = req.body;
  
    const renderWithErrors = (errors) => {
      res.render('auth/register', {
        errors: errors,
        user: user
      })
    }
  
    User.findOne({ email: email })
      .then((userFound) => {
        if (userFound) {
          renderWithErrors({ email: 'Email already in use!' })
        } else {
          return User.create(user).then(() => res.redirect('/'))
        }
      })
      .catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
          renderWithErrors(err.errors)
        } else {
          next(err)
        }
      })
  }


module.exports.login = (req, res, next) => {
  res.render('auth/login')
}

module.exports.doLogin = (req, res, next) => {
  const user = { username, password } = req.body;

  const logginWithErrors = (errors) => {
    res.render('auth/user-profile', {
      errors: errors,
      user: user
    })
  }

  User.findOne({ username: username })
    .then((registerUserFound) => {
      if (registerUserFound) {
          logginWithErrors();
        }
      } 
    )
    .catch(err => {
      next(err)
    })
}
