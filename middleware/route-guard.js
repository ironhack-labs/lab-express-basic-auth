const authMiddleware = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = authMiddleware;
