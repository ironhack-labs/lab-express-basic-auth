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
        // lo intento crear- la promesa con un return comparte el catch
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
        renderWithErrors(err.errors) // verificamos que el error es una instacia de validacion de mongoose
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
        renderWithErrors() // la password esta mal
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {       
              req.session.userId = user.id  // la contraseña ha estado bien y coincide con el hasheo
              res.redirect('user/profile')
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