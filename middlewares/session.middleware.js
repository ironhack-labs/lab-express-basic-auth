const User = require('../models/User.model')

module.exports.isAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user

        next()
      } else {
        res.redirect('/login')
      }
    })
    .catch(next);
}