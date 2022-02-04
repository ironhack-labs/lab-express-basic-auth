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
        .then(() => res.redirect('/'))
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


    const user = { name, email, password } = req.body;
        //hacemos lo mismo que en register, pero esta vez requerimos email
       const renderWithLoginErrors = (errors) => {
         console.log(email)
         res.render('auth/login', {
           user: user,
           errors: {
             email: 'Invalid user or password'
           }
         })
       }

       // buscamos email, en caso de que no lo encuentre (!user) lanzamos error
       User.findOne({ email: email })
         .then(user => {
             if (!user) {
               renderWithLoginErrors()
             } else {

                // checkeamos el match del password. en caso negativo lanzamos error
                // en caso positivo lanzamos login
               return user.checkPassword(password)
                 .then(match => {
                   if (!match) {
                     renderWithLoginErrors()
                   } else {
                     res.send('correct password, logged in!')
                   }
                 })
             }
         })
         .catch((error) => next(error))
     }