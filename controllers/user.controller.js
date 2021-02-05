const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports.profile = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => res.render('users/userProfile', user))
        .catch(err => next(err))
};

module.exports.register = (req, res, next) => res.render('auth/signup');

module.exports.doRegister = (req, res, next) => {
    console.log(req.body)
    function renderWithErrors(errors) {
        
        res.status(400).render('auth/signup', {
          errors: errors,
          user: req.body
        })
      }
    
      User.find({ email: req.body.email })
        .then((user) => {
          if (user) {
            renderWithErrors({
              email: 'Ya existe un usuario con este email'
            })
          } else {
            User.create(req.body)
              .then(() => {
                res.redirect('/')
              })
              .catch(e => {
                if (e instanceof mongoose.Error.ValidationError) {
                    console.log(req.body)
                    console.log('soy el catch')
                  renderWithErrors(e.errors)
                } else {
                  next(e)
                }
              })
          }
        })
        .catch(e => next(e))
};