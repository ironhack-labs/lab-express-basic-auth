    const isLoggedOut = (req, res, next) => {
    if (!req.session.user) res.redirect('/not-pass');
    next();
  };
  
  module.exports = isLoggedOut;