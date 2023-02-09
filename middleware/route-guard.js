const isLoggedIn = (req, res, next) => {
    //Si no esta loggueado, dime quien eres
    if (!req.session.currentUser) {
      return res.redirect('/login');
    }
    next();
  };
   
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isLoggedOut = (req, res, next) => {
    //Si ya esta loggeado no entras
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  };
   
  module.exports = {
    isLoggedIn,
    isLoggedOut
  };