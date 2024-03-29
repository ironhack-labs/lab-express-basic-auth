const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      // User is logged in, proceed to the next middleware/route handler
      next();
    } else {
      // User is not logged in, redirect to the login page
      res.redirect('/login');
    }
  };
  
  module.exports = isAuthenticated;