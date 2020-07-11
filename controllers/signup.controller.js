const User = require('../models/User.model')

exports.drawIndex = (req, res, next) => { res.render('index') }

exports.drawProfile = (req, res, next) => { 
  User.findById(req.session.userId)
    .then (user => res.render('profile', user))
    .catch (e => res.send(e))
}

exports.drawLogin = (req, res, next) => { res.render('login') }

exports.doLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        user.comparePassword(req.body.password)
          .then(match => {
            if (match) {
              req.session.userId = user._id
              res.redirect('/profile')
            } else {
              res.send('Wrong!!!')
            }
          })
      }
    })
    .catch( e => res.send(e))
}

exports.drawSignup = (req, res, next) => { res.render('signup') }

exports.createUser = (req, res, next) => {
    User.create(req.body)
      .then(user => {
        res.redirect('login')
      })
      .catch((e) => {
          console.log(e)
          next()
      })  
}

exports.logout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/login')
}