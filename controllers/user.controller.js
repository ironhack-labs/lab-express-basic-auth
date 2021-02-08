const User = require('../models/User.model')
const mongoose = require('mongoose') // vamos a utilizar funcionalidades de mongoose para detectar que el error es de validación


module.exports.registerView = (req, res, next) => {
    res.render('user/register')
}

module.exports.registerThanks = (req, res, next) => {
    res.render('user/thanks')
}

module.exports.register = (req, res, next) => {
    function renderErrors(errors) {
        res.status(400).render('user/register', { 
            errors: errors,
            user: req.body                                                     // Para que no se borre el contenido ya escrito si hay error => en la vista en value user:email
        })
    }

    User.findOne({ email: req.body.email })                                    // Query para validar si ya existe en mi BD
        .then((u) => {                                                         // podría tener mi usuario si ya existe o devolver undefined
            if (u) {                                                           // si existe, no podemos dejar que se crea
                renderErrors({ email: 'This email is already signed in'})
            } else if (req.body.password !== req.body.passwordRepeat) {
                renderErrors({ password: 'Please insert the same password'})
            } else {                                                           // no lo encuentra, procedemos
                User
                    .create(req.body)
                    .then((u) => {
                        res.redirect('/thanks')
                    })
                    .catch((e) => {
                                                                                // levaría al middelware de errores de www. No hacerlo:
                                                                                // ¿el e que me llega es una instancia de mongoose.error.validation error?
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderErrors(e.errors)                              //volver a mandar a la vista con la info pero con errores
                        } else {
                            next(e)                                             // si no es de valid, enviar al middelware de errores
                        }
                    })
            }
        })
        .catch((e) => next(e))

}

module.exports.loginView = (req, res, next) => {
    res.render('user/login')
}

module.exports.login = (req, res, next) => {
    function renderErrors(errors) { 
        res.status(400).render('user/login', { 
            errors: ['The email or the password are not correct'],
            user: req.body
        })
    }

    User.findOne({ email: req.body.email })  // $or[{ email: req.body.email }, { username: req.body.username }]
      .then((u) => {
          if(!u) {
              renderErrors()
          } else {
              u.checkPassword(req.body.password)
              .then((same) => {                                         // manejo la promesa del method checkPasswodr del modelo User
                if (!same) {
                    renderErrors()
                } else {
                    req.session.currentId = u.id

                    res.redirect('../in')
                }
              })
          }

      })
      .catch(e => next(e))
}

module.exports.in = ((req, res, next) => {
    res.render('user/in')
})

module.exports.logout = ((req, res, next) => {
    req.session.destroy()
    res.redirect('/')
}) 