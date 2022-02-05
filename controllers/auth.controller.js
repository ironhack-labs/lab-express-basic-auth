const mongoose = require('mongoose');
const User = require('../models/User.model');


// Pinta página formulario de registro
module.exports.register = (req, res, next) =>  {
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
  const { email, password } = req.body;

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
          .then(match => {
            if (!match) {
              logginWithErrors();
            } else {
              res.render("auth/profile", { userFound })
            }
          })
        }
      } 
    )
    .catch((err) => {
     console.log(err)
    })
}










// Tareas a realizar al darle al botón "Login" del formulario anterior
// module.exports.doLogin = (req, res, next) => {
//   const { email, password } = req.body;
// 
//   /* const logginWithErrors = (errors) => {
//     res.render('auth/user-profile', {
//       errors: errors,
//       user: user
//     })
//   } */
// 
//   User.findOne({ email: email }) // 2º parámetro = email del req.bdoy
//     .then((user) => {
//       console.log(user)
// 
//       if (!user) {
//         res.render('auth/login', { // 2º parámtetro: objeto con clave errors, que a su vez es otro objeto con clave "email"
//           errors : { // Nombre de la vista
//             email: 'Email or password invalid!' // Clave de la vista
//           }
//          })
//         } else {
//           res.render('auth/profile', { user });
//         }
//       } 
//     )
//     .catch((err) => {
//      console.log(err)
//     })
// }
//



