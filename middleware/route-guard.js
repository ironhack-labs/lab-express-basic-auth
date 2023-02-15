const isLoggedIn = (req, res, next) => {
    if (!req.session.user) res.redirect('/private');
    next();
  };
  
  const isLoggedOut = (req, res, next) => {
    if (req.session.user) res.redirect('/main');
    next();
  };
  
  module.exports = { isLoggedIn, isLoggedOut };