const User = require('../models/User.model')

exports.drawIndex = (req, res, next) => { res.render('index') }

exports.drawSignup = (req, res, next) => { res.render('signup') }

exports.createUser = (req, res, next) => {
    User.create(req.body)
      .then(user => {
        res.render('index', {user})
      })
      .catch((e) => {
          console.log(e)
          next()
      })  
}