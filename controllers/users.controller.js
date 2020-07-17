const mongoose = require('mongoose')
const User = require('../models/user.model')

module.exports.signUp = (req, res, next) => res.render('signup')

module.exports.newUser = (req, res, next) => {
  if(req.body.checkbox != 'on'){
    console.log(`checkbox is ${req.body.checkbox}`)
    res.render('signup',{
      error: {
        message: 'Read ToS and User Agreement Required',
      }
    })
  } else {
    const user = new User(req.body)
    user.save()
    .then(() => res.redirect('login'))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('signup', { error: error.errors, user })
      } else if (error.code === 11000) {
        res.render('signup', {
          user,
          error: {
            message: 'user already exists',
          },
        })
      } else {
        next(error)
      }
    })
    .catch(next)
  }
}

module.exports.logIn = (req, res, next) => {
  res.render('login')
}

module.exports.doLogIn = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        user.checkPassword(req.body.password)
        .then((passwordMatch) => {
          if (passwordMatch) {
            console.log('pass match')
            req.session.userId = user._id
            res.redirect('welcome')
          } else {
              console.log('pass no match')
            res.render('login', {
              error: {
                message: 'user not found or password doesnt match'
              }
            })
          }
        })
      } else {
        res.render('login', {
          error: {
            message: 'user not found or password doesnt match'
          }
        })
      }
    })
    .catch(next)
}

module.exports.welcome = (req,res,next) => {
  console.log(req.currentUser)
  res.render('welcome-user',{user: req.currentUser})
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/login')
}
