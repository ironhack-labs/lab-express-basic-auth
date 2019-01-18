const User = require('../models/user.model');
const mongoose = require('mongoose');

module.exports.index = (req, res, next) => {
  res.render('auth/index');
}

module.exports.register = (req, res, next) => {
  res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {
  User.findOne({ name: req.body.name})
    .then(user => {
      if (user) {
        res.render('auth/register', {
          user: req.body,
          errors: {
            name: 'This User name already registered'
          }
        });
      } else {
        user = new User({
          name: req.body.name,
          password: req.body.password,
        });

        return user.save()
          .then(user => {
            res.redirect('/login');
          });
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('auth/register', {
          user: req.body,
          errors: error.errors
        });
      } else {
        next(error);
      }
    });
}

module.exports.login = (req, res, next) => {
  res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  if (!name || !password) {
    res.render('auth/login', {
      user: req.body,
      errors: {
        name: name ? undefined : 'Name is required',
        password: password ? undefined : 'Password is required',
      }
    });
  } else {
    User.findOne({ name: name})
      .then(user => {
        if (!user) {
          res.render('auth/login', {
            user: req.body,
            errors: {
              name: 'Invalid Name or Password',
            }
          });
        } else {
          return user.checkPassword(password)
            .then(match => {
              if (!match) {
                res.render('auth/login', {
                  user: req.body,
                  errors: {
                    name: 'Invalid Name or Password',
                  }
                });
              } else {
                req.session.user = user;
                res.redirect('/private');
              }
            })
        }
      })
      .catch(error => next(error));
  }
}


module.exports.private = (req, res, next) => {
  const user = req.session.user;
  res.render('auth/private', {
    user: user
  });
}