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
  User.find({$or:[{email: req.body.email},{username:req.body.username}]})
    .then((user) => {
      if (user.length > 0) {
        console.log(user)
        renderWithErrors({
          username: 'Ya existe un usuario o email con este nombre'
        })
      }
      else { //Creamos el usuario
        User.create(req.body)
          .then(() => {
            console.log('The form data: ', req.body.username);
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