const User = require("../models/user.model");
const mongoose = require("mongoose");


module.exports.register = (req, res, next) => {
  res.render("auth/register")
}

module.exports.doRegister = (req, res, next) => {
  User.findOne({username: req.body.username})
    .then(user => {
      if(user){
        res.render("auth/register", {
          user: req.body,
          errors: {
            username: 'Username already exists'
          }
        });
      } else {
        user = new User({
          username: req.body.username,
          password: req.body.password,
        });
        return user.save()
          .then(user => {
            res.redirect("/login")
          })
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
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.render('auth/login', {
      user: req.body,
      errors: {
        username: username ? undefined : 'username is required',
        password: password ? undefined : 'password is required'
      }
    });
  } else {
    User.findOne({ username: username })
      .then(user => {
        if (!user) {
          res.render('auth/login', {
            user: req.body,
            errors: {
              username: 'Invalid username or password'
            }
          });
        } else {
          return user.checkPassword(password)
            .then(match => {
              if(!match) {
                res.render('auth/login', {
                  user: req.body,
                  errors: {
                    username: 'Invalid username or password'
                  }
                })
              } else {
                req.session.user = user;
                res.redirect('/profile')
              }
            })
        }
      })
      .catch(error => next(error));
  }
}

module.exports.profile = (req, res, next) => {
  const user = req.session.user;
  res.render('auth/profile', {
    user: user
  });
}

module.exports.secret = (req, res, next) => {
  res.render('auth/secret');
}

module.exports.logout = (req, res, next) => {
  req.session.destroy((err) => { res.redirect("/login")});
}