const User = require('../models/user.model');
const mongoose = require('mongoose');

module.exports.register = (req, res, next) => {
  res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
        res.render('auth/register', {
          user: req.body,
          errors: {
            username: username ? undefined : 'Username is required',
            password: password ? undefined : 'Password is required',
          }
        });
  } else {
    User.findOne({username})
      .then(user => {
        if (user) {
          res.render('auth/register', {
            user: req.body,
            errors: {
              username: 'Username already registered'
            }
          });
        } else {
          user = new User({
            username,
            password
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
}

module.exports.login = (req, res, next) => {
  res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.render('auth/login', {
      user: req.body,
      errors: {
        username: username ? undefined : 'Username is required',
        password: password ? undefined : 'Password is required',
      }
    });
  } else {
    User.findOne({username})
      .then(user => {
        if (!user) {
          res.render('auth/login', {
            user: req.body,
            errors: {
              username: 'Invalid username or password',
            }
          });
        } else {
          return user.checkPassword(password)
            .then(match => {
              if (!match) {
                res.render('auth/login', {
                  user: req.body,
                  errors: {
                    username: 'Invalid username or password',
                  }
                });
              } else {
                req.session.user = user;
                res.redirect('/main');
              }
            })
        }
      })
      .catch(error => next(error));
  }
}