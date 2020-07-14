const User = require('../models/User.model')
const mongoose = require('mongoose')

module.exports.login = (_, res) => {
  res.render('users/login')
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        user.checkPassword(req.body.password).then((match) => {
          if (match) {
            req.session.userId = user._id
            res.redirect('/welcome')
          } else {
            res.render('users/login', {
              error: {
                username: {
                  message: 'user not found'
                }
              }
            })
          }
        })
      } else {
        res.render('users/login', {
          error: {
            username: {
              message: 'user not found'
            }
          }
        })
      }
    })
    .catch(next)
}

module.exports.signup = (_, res) => {
  res.render('users/signup', { user: new User() })
}

module.exports.create = (req, res, next) => {
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
    bio: req.body.bio
  })

  user
    .save()
    .then((user) => {
      res.redirect('/')
    })
    .catch((error) => {
      res.render('users/signup', { user, error: error.errors })
    })
}

module.exports.welcome = (req, res, next) => {
  res.render('users/welcome', {
    user: req.currentUser
  })
}

module.exports.edit = (req, res, next) => {
  res.render('users/edit', {
    user: req.currentUser
  })
}

module.exports.updated = (req, res, next) => {
  const body = req.body
  const username = req.params.username
  User.findOneAndUpdate(username, body)
    .then(() => res.redirect('/welcome'))
    .catch((error) => console.log(error))
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}
