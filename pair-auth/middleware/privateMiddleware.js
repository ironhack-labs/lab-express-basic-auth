'use strict';

const privateMiddleware = {};

privateMiddleware.requireAnon = (req, res, next) => {
  if (!req.session.currentUser) {
    // meaning that if there's a user logged in
    return res.redirect('/');
  }
  next();
};

module.exports = privateMiddleware;
