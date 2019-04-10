const mongoose = require('mongoose')
const User = require('../models/user.model')


module.exports.register = (req,res,next) => {
  res.render('auth/register')
}

module.exports.doRegister = (req,res,next) => {
  
  const renderErrors = (errors) => {
    res.render('auth/register',{
      user: req.body,
      errors:errors
    })
  }

  User.findOne({email:req.body.email})
    .then(user=>{
      if(user) {
        renderErrors({ email: 'Email already registered'})
      } else {
        const user = new User(req.body)
        return user.save()
          .then(res.redirect('/login'))
      }
    })
    .catch()


}