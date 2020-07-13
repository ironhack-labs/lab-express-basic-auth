const User = require('../models/user.model')

module.exports.isAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user
        res.locals.currentUser = user

        next()
      } else {
        res.redirect('/login')
      }
    })
    .catch(next);
}

module.exports.isNotAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (user) {
        res.redirect("/");
      } else {
        next();
      }
    })
    .catch(next);
};
