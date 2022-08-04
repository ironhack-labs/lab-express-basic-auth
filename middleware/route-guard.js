// confirmar se o utilizador esta login e manter a conta loggada
const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect('/login');
    }
    next();
  };
  
  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  };
  
  module.exports = {
    isLoggedIn,
    isLoggedOut,
  };