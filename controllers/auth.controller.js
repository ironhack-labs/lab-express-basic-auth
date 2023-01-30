const createError = require('http-errors');
const mongoose = require ('mongoose')
const User = require ('../models/User.model')


module.exports.signup = (req, res) => {
    res.render('auth/signup.hbs')
}

module.exports.isAuthenticated = (req, res, next) => {
  // para saber si esta autenticado
  if (req.currentUser) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports.isNotAuthenticated = (req, res, next) => {
  // para saber si esta autenticado
  if (!req.currentUser) {
    next()
  } else {
    res.redirect('/profile')
  }
}

module.exports.doSignup = (req, res, next) => {
    const renderWithErrors = (errors) => {
      res.render('auth/signup', {
        user: {
          email: req.body.email,
          username: req.body.username
        },
        errors
      })
    }
  
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
         
          return User.create(req.body)
            .then(user => {
              res.redirect('/')
            })
        } else {
          renderWithErrors({ email: 'Email already in use' })
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

  module.exports.profile = (req, res) => {
    res.render('user/user-profile')
  }

  module.exports.login = (req, res) => {
    res.render('auth/login')
  }

  module.exports.doLogin = (req, res, next) => {
    const { email, password } = req.body;
    const renderWithErrors = () => {
      res.render('auth/login', {
       user: {email},
       errors: { email: 'Email or password are incorrect' }
      })
    }

    if (!email || !password) {
      renderWithErrors()
    }

    User.findOne({ email })
    .then(user => {
      if(!user) {
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
        
        }
      })
      .catch(err => {
        next(err)
      })
     
  }