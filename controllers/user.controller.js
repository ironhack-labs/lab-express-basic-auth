const mongoose = require("mongoose")
const User = require("../models/User.model")
module.exports.register = (req, res, next) => {
    res.render('users/register')
}
module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render('users/register', {
            errors: errors,
            user: req.body
        })
    }
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    email: 'Este mail ya ha sido registrado'
                })
            } else {
                User.create(req.body)
                    .then(() => {
                        res.redirect('/')
                    })
                    //Errores de validación del modelo en el catch
                    .catch(e => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderWithError(e.errors)
                        } else {
                            next(e)
                        }
                    })
            }
        })
        .catch(e => next(e))
}

module.exports.login = (req, res, next) => {
    res.render('users/login')
  }
  
  module.exports.doLogin = (req, res, next) => {
    function renderWithErrors() {
      res.render('users/login', {
        user: req.body,
        error: 'El correo electrónico o la contraseña no son correctos'
      })
    }
  
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          renderWithErrors()
        } else {
          user.checkPassword(req.body.password)
            .then(match => {
              if (!match) {
                renderWithErrors()
              
                
              } else {
              req.session.currentUserId = user.id

                res.redirect('/profile')
              }
            })
        }
      })
      .catch(e => next(e))
  }

  module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/profile')
  }


  module.exports.profile = (req, res, next) => {
    res.render('users/profile')
  }

  module.exports.main = (req, res, next) => {
    res.render('users/main')
}
module.exports.private = (req, res, next) => {
    res.render('users/private')
}