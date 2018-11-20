'use strict';

const authMiddleware = {};

authMiddleware.requireAnon = (req, res, next) => {
  if (req.session.currentUser) {
    // meaning that if there's a user logged in
    return res.redirect('/');
  }
  next();
};

authMiddleware.requireUser = (req, res, next) => {
  if (!req.session.currentUser) {
    // meaning that if there ISN'T a user logged in you cannot access the logout page
    return res.redirect('/auth/login');
  }
  next();
};

module.exports = authMiddleware;
