const mongoose = require("mongoose")
const User = require("../models/user.model")

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

  //Para comprobar que no existe un email así ya en la base de datos (Mejor q el unique)
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        renderWithErrors({
          email: 'Ya existe un usuario con este email'
        })
      } else { //Creamos el usuario
        User.create(req.body)
          .then(() => {
            res.redirect('/')
          })
          .catch(e => { //Incluye los errores de validación de mongoose
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