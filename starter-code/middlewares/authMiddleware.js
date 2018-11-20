'use strict';

const authMiddleware = {};

authMiddleware.requireAnon = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/celebrities');
  }
  next();
};

authMiddleware.requireUser = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  next();
};

module.exports = authMiddleware;
