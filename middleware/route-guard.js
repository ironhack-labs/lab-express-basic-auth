const isLoggedIn = (req, res, next) => {
    if (!req.session.user) res.redirect('/login');
    next();
  };
  
  const isLoggedOut = (req, res, next) => {
    if (req.session.user) res.redirect('/');
  };
  
  /*
  
  const isLoggedIn = (req, res, next) => {
    if (req.session.user) res.redirect('/');
  };
  
  const isLoggedin = (req, res, next) => {
    if (req.session.user) res.redirect('/');
  };
  */


  module.exports = { isLoggedIn, isLoggedOut };
  