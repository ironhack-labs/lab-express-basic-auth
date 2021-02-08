const mongoose = require("mongoose")
//require model
const User = require("../models/User.model")


//Show user signUp
module.exports.register = (req,res,next) => {
    res.render('authentication/auth_form')
}

//Create user
module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
      res.status(400).render('authentication/auth_form', {
        errors: errors,
        user: req.body
      })
    }
  
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          renderWithErrors({
            email: 'Ya existe un usuario con este email'
          })
        } else {
          User.create(req.body)
            .then(() => {
              res.redirect('/')
            })
            .catch(e => {
              if (e instanceof mongoose.Error.ValidationError) {
                renderWithErrors(e.errors)
              } else {
                next(e)
              }
            })
        }
      })
      .catch(e => next(e))
  }


//user login
module.exports.login = (req,res,next) => {
  res.render('authentication/login_form')
}


module.exports.doLogin = (req, res, next) => {
  function renderWithErrors() {
    res.render('/authentication/login_form', {
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
            if (match) {
              req.session.currentUserId = user.id

              res.redirect('/profile')
            } else {
              renderWithErrors()
            }
          })
      }
    })
    .catch(e => next(e))
}

//profile
module.exports.profile = (req, res, next) => {
  res.render('authentication/profile')
}

//logout
module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}