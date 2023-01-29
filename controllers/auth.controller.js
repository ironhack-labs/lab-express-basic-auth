const mongoose = require ('mongoose')
const User = require ('../models/User.model')


module.exports.signup = (req, res) => {
    res.render('auth/signup.hbs')
}

module.exports.doSignup = (req, res, next) => {
    const renderWithErrors = (errors) => {
      res.render('auth/signup', {
        user: {
          email: req.body.email,
          username: req.body.username
        },
        errors
      })
    }
  
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
         
          return User.create(req.body)
            .then(user => {
              res.redirect('/')
            })
        } else {
          renderWithErrors({ email: 'Email already in use' })
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
