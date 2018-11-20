'use strict';

const formMiddleware = {};

formMiddleware.requireField = (req, res, next) => {
  console.log('middleware');
  const { username, password } = req.body;
  if (!username) {
    req.flash('error', 'Username cannot be empty');

    // we return because if not the code would keep running
    // username and password fields cannot be empty

    return res.redirect(`/auth${req.path}`);
  } else if (!password) {
    req.flash('error', 'Password cannot be empty');
    return res.redirect(`/auth${req.path}`);
  }
  next();
};

module.exports = formMiddleware;
