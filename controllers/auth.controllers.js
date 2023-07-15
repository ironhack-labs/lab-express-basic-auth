const mongoose = require('mongoose')
const User = require('../models/User.model')

module.exports.signup = (req, res, next) => {
  res.render('signUpForm')

}

module.exports.doSignUp = (req, res, next) => {

  const renderWithErrors = (errors) => {
    res.render('signUpForm', {
      user: {
        username: req.body.username,
        email: req.body.email,
      },
      errors
    });
  };

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return User.create(req.body)
          .then(user => {
            res.redirect('/login');
          });
      } else {
        renderWithErrors({ email: 'Email already registered' });
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors);
      } else {
        next(error)
      }

    });
};

module.exports.login = (req, res, next) => {
  res.render('login')
}

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  const renderWithErrors = () => {
    res.render('login', {
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
    .then((user) => {
      if (!user) {
        renderWithErrors();
      } else {
        user.checkPassword(password)
          .then(match => {
            if (!match) {
              renderWithErrors();
            } else {
              req.session.userId = user.id;
              res.redirect('/user/profile');
            }
          })
          .catch(error => renderWithErrors())

      }
    })
    .catch(error => next(error))

};

module.exports.logout = (req, res, next) => {
  req.session.destroy(); //eliminamos la sesion de ls DB
  res.clearCookie('connect.sid')
  res.redirect('/login')
};