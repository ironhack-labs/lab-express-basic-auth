const mongoose = require('mongoose')
const User = require('../models/User.model')



// go to the register.hbs
module.exports.register = (req, res, next) => {
    res.render('auth/register');
  }


// show in console the form datas
// module.exports.doRegister = (req, res, next) => {
//   //const user = { name, email, password } = req.body;
//   console.log("user",req.body)
// }


module.exports.doRegister = (req, res, next) => {
  const user = { name, email, password } = req.body;
  console.log(req.body)
  // const renderWithErrors = (errors) => {
  //   res.render('auth/register', {
  //     errors: errors,
  //     user: user
  //   })
  //}

  // User.findOne({ email: email })
  //   .then((userFound) => {
  //     if (userFound) {
  //       renderWithErrors({ email: 'Email already in use!' })
  //     } else {
  //       return User.create(user).then(() => res.redirect('/'))
  //     }
  //   })
  //   .catch(err => {
  //     if (err instanceof mongoose.Error.ValidationError) {
  //       renderWithErrors(err.errors)
  //     } else {
  //       next(err)
  //     }
  //   })
}