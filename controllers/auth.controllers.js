const User = require('../models/User.model');

module.exports.signup = (req, res, next) => {
  res.render('auth/signup');
};

module.exports.doSignup = (req, res, next) => {
  console.log('body: ', req.body);
  User.create(req.body)
    .then(user => {
      console.log('Created user: ', user);
      res.redirect('/');
    })
    .catch(error => {
      console.error(error);
      res.render('auth/signup', { user: req.body, error });
    });
};