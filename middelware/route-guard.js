const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
      // User is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, redirect to the login page or return an error response
      res.redirect('/login');
      // or
      res.status(401).send({
        message: 'Unauthorized',
      });
    }
  };
  
  module.exports = authMiddleware;