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
        renderWithErrors({ email: 'Email already in use!' })
      } else {
        return User.create(user)
        .then(() => res.redirect('/login'))
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


//Pintamos en auth/login.hbs
module.exports.login = (req, res, next) => {
    res.render('auth/login')
}

module.exports.doLogin = (req, res, next) => {


    const { email, password } = req.body;
        //hacemos lo mismo que en register, pero esta vez requerimos email
       const renderWithLoginErrors = (errors) => {
         console.log(email)
         res.render('auth/login', {
           user: req.body,
           errors: {
             email: 'Invalid user or password'
           }
         })
       }

       // buscamos email, en caso de que no lo encuentre (!user) lanzamos error
       User.findOne({ email: email })
         .then(userFound => {
             if (!userFound) {
               renderWithLoginErrors()
             } else {

                // checkeamos el match del password. en caso negativo lanzamos error
                // en caso positivo lanzamos login
               return userFound.checkPassword(password)
                 .then(match => {
                   if (!match) {
                     renderWithLoginErrors()
                   } else {
                       console.log('la creo')
                    req.session.userId = userFound.id;
                    res.redirect("/profile")
                   }
                 })
             }
         })
         .catch((error) => next(error))
     }

     module.exports.logout = (req, res, next) => {
         req.session.destroy()
         console.log('logout: ', req.session)
         res.redirect("/")
     }