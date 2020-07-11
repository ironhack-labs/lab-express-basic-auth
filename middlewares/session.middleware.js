const User = require('../models/user.model')

exports.isAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user
        res.locals.currentUser = user
        next()
      } else {
        res.redirect('/users/login')
      }
    })
    .catch(next);
}

exports.isNotAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (user) {
        res.redirect('/users/logout')
      } else {
        next();
      }
    })
    .catch(next);
};