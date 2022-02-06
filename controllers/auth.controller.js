const mongoose = require('mongoose');
const User = require('../models/User.model');


// Pinta página formulario de registro
module.exports.register = (req, res, next) =>  { // register = propiedad del module.exports
    res.render('auth/register')
}


// Tareas a realizar al darle al botón "Register" del formulario anterior
module.exports.doRegister = (req, res, next) => {
    const user = { username, email, password } = req.body;
  
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


// Pinta página con formulario de login
module.exports.login = (req, res, next) => {
  res.render('auth/login'); 
}


// Tareas a realizar al darle al botón "Login" del formulario anterior
module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body; // req.body = datos del formulario de login

  const logginWithErrors = () => {
    res.render('auth/login', {
      errors: {email: 'Invalid email or password!'},
      user: req.body
    })
  }

  User.findOne({ email: email }) // 2º parámetro = email del req.bdoy
    .then((userFound) => {

      if (!userFound) {
        logginWithErrors()
        } else {
          return userFound.checkPassword(password)
          //Con el usuario encontrado, ejecutamos el método Checkpassword del model user (requerido en la variable "User"), pasando la contraseña del body
          .then(match => {
            if (!match) {
              logginWithErrors();
            } else {
              req.session.userId = userFound.id;
              // req.session.userId = "userId" es una clave del objeto session. 
              res.redirect("/profile")
            }
          })
        }
      } 
    )
    .catch((err) => next(err))
}


module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}


