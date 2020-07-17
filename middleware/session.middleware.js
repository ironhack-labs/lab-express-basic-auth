const User = require("../models/User.model");

module.exports.authentication = (req, res, next) => {
  const userId = req.session.userId;
  User.findById(userId)
    .then((user) => {
      if (user) {
        req.currentUser = user;
        res.locals.currentUser = user;
        next();
      } else {
        res.redirect("/login");
      }
    }).catch(next);
};

module.exports.isNotAuthenticated = (req, res, next) => {
  const userId = req.session.userId;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.redirect("/");
      } else {
        next();
      }
    }).catch(next);
};
