const mongoose = require('mongoose')
const User = require('../models/User.model')



// go to the register.hbs
module.exports.register = (req, res, next) => {
    res.render('auth/register');
  }



// check the form
// if errors in the form, display error. render auth/register'
// if email already exixts , display error. render auth/register'
// if OK create user and redirect('/')
module.exports.doRegister = (req, res, next) => {
  const user = { name, email, password } = req.body;
 
  const renderWithErrors = (errors) => {
    res.render('auth/register', {
      errors: errors,  // we pass the errors 
      user: user       // we pass the user data to be displayed in the form
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
        //console.log(err)
        //console.log("adassdasdasdadsa",err.errors)
        renderWithErrors(err.errors)
      } else {
        next(err)
      }
    })
}

// create  a user 
// module.exports.doRegister = (req, res, next) => {
//   const user = { name, email, password } = req.body;
//   User.create(user)
//   .then(()=> console.log("user added ",user))
//   .catch(err => next(err))
// }

