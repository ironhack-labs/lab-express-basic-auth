// const createError = require("http-errors");
const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.signup = (req, res, next) => {
  res.render('auth/signup');
}

module.exports.doSignup = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render('auth/signup', {
      user: {
        username: req.body.username,
    
      },
      errors
    })
  }

  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        // lo creo
        return User.create(req.body)
          .then(user => {
            res.redirect('/')
          })
      } else {
        renderWithErrors({ username: 'Email already in use' })
      }
    }) // o un usuario || null
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
  const { username, password } = req.body;

  const renderWithErrors = () => {
    res.render(
      'auth/login',
      {
        user: { username },
        errors: { username: 'Email or password are incorrect' }
      }
    )
  }

  if (!username || !password) {
    renderWithErrors()
  }

  // Comprobar si hay un usuario con este username
  User.findOne({ username }) // dklashdlkjashDFJKSAHFIJSDAHKL - 12345678
    .then(user => {
      if (!user) {
        renderWithErrors()
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              renderWithErrors()
            } else {
              req.session.userId = user.id
              res.redirect('/profile')
            }
          })
        // Comprobamos que la contraseña sea correcta
      }
    })
    .catch(err => {
      next(err)
    })
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/login')
}