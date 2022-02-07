const mongoose = require('mongoose')
const User = require('../models/User.model')

// ------------------------------------------
// Controlador del registro //
// ------------------------------------------

module.exports.register = (req, res, next) => {
  res.render('auth/register')
}

module.exports.doRegister = (req, res, next) => {
  const user = { name, email, password } = req.body;

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


// ------------------------------------------
// Contralador del login //
// ------------------------------------------

module.exports.login = (req, res, next) => {
  res.render('auth/login')
}

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
  .then(userFound => {
      console.log('Usuario encontrado', userFound)
      if (!userFound) {
        renderWithErrors()
      } else {
        return userFound.checkPassword(password)
          .then(match => {
            if (!match) {
              renderWithErrors()
            } else {
              console.log('Cookie Session', req.session)
              req.session.userId = userFound._id;
              res.redirect("/profile")
            }
          })
      }
    })
    .catch((err) => next(err))
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}
