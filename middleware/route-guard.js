const isLoggedIn = (req, res, next) => {
    if (!req.session.user) res.redirect('/login');
    next();
  };
  
  const isLoggedOut = (req, res, next) => {
    if (req.session.user) res.redirect('/');
    next()
  };
  
  module.exports = { isLoggedIn, isLoggedOut };