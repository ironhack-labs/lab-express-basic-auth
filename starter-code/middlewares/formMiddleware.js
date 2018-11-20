'use strict';

const formMiddleware = {};

formMiddleware.requireFields = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('Error', 'Fields empty');
    return res.redirect(`/auth${req.path}`);
  }
  next();
};

module.exports = formMiddleware;
