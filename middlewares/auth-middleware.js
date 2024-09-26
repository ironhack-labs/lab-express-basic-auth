module.exports.isAuthenticated = (req, res, next) => {
    if (req.currentUser) {
      next();
    } else {
      res.redirect('/login');
    }
  };
  
  module.exports.isNotAuthenticated = (req, res, next) => {
    if (req.currentUser) {
      res.redirect('/user/profile');
    } else {
      next();
    }
  };