const authMiddleware = (req, res, next) => {
    if (req.session.user) {
      // User is authenticated, allow access to the next middleware
      next();
    } else {
      // User is not authenticated, redirect to login page
      res.redirect('/login');
    }
  };
  
  module.exports = authMiddleware;