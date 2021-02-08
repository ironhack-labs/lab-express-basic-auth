const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports.profile = (req, res, next) => {
  res.render('users/userProfile');
};

module.exports.signup = (req, res, next) => res.render('auth/signup');

module.exports.doSignup = (req, res, next) => {
    function renderWithErrors(errors) {
        console.error('password: ', errors.password)
        res.status(400).render('auth/signup', {
          errors: errors,
          user: req.body
        })
      }
    
      User.findOne({ email: req.body.email })
        .then((user) => {
          if (user) {
            renderWithErrors({
              email: 'This email is already registered'
            })
          } else {
            User.create(req.body)
              .then(() => {
                res.redirect('/')
              })
              .catch(e => {
                if (e instanceof mongoose.Error.ValidationError) {
                    console.log('soy el catch')
                  renderWithErrors(e.errors)
                } else {
                  console.error(e)
                  next(e)
                }
              })
          }
        })
        .catch(e => {
          console.error(e)
          next(e)
        })
};

module.exports.login = (req, res, next) => res.render('auth/login');

module.exports.doLogin = (req, res, next) => {
  function renderWithErrors(errors) {
    console.error(errors)
    res.status(400).render('auth/login', {
      errors: errors,
      user: req.body
    })
  }
  console.log('req.body: ', req.body)

  User.findOne({ userName: req.body.userName })
    .then(user => {
      console.log('user: ', user)
      if (!user) {
        renderWithErrors()
      } else {
        user.checkPassword(req.body.password)
          .then(match => {
            if (match) {
              console.log('req.session: ', req.session)
              req.session.currentUserId = user.id
              res.redirect('/users/userProfile')
            } else {
              renderWithErrors()
            }
          })
      }
    })
    .catch(e => next(e));
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}

module.exports.delete = (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/'))
    .catch(err => next(err));
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}