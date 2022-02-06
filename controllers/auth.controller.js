const mongoose = require('mongoose')
const User = require('../models/User.model')

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
        renderWithErrors({ email: 'This email is already in use!' })
      } else {
        // Si se usa return nos podemos ahorrar el catch del then dentro del que esté y pasar al global.
        return User.create(user).then(() => res.redirect('/login'))
      }
    })
    .catch (err => {
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

  const renderWithLoginErrors = (errors) => {
    res.render('auth/login', {
      user: req.body,
        errors: {
        email: 'Invalid user or password'
      }
    })
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if(!user){
        renderWithLoginErrors()
      } else {
        return user.checkPassword(req.body.password)
          .then((match) => {
            if (!match){
              renderWithLoginErrors()
            } else {
              res.render('user/profile')
            }
          })
      }
    })
    .catch((error) => next(error))
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}