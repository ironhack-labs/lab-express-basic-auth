const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.signup = (req, res, next) => {
  res.render('auth/signup');
};

module.exports.doSignup = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render('auth/signup', {
      user: {
        email: req.body.email,
        name: req.body.name
      },
      errors
    });
  };
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        // lo creo y redirijo
        return User.create(req.body)
          .then(user => {
            res.redirect('/login');
          });
      } else {
        renderWithErrors({ email: 'Email already in use' })
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log('******: ', error.errors);
        renderWithErrors(error.errors);
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render('auth/login');
};

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  const renderWithErrors = () => {
    res.render('auth/login', { 
      user: {
        email
      },
      errors: { email: 'Email or password are incorrect' }
    });
  };

  if (!email || !password) {
    renderWithErrors();
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        renderWithErrors();
      } else {
        user.checkPassword(password)
          .then((match) => {
            if (!match) {
              renderWithErrors();
            } else {
              req.session.userId = user.id;
              res.redirect('/user/profile');
            }
          })
          .catch(() => renderWithErrors());
      }
    })
    .catch(error => next(error));
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/login');
};