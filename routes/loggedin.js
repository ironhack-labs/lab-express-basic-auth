const isLoggedIn = (req, res, next) => {
  if(!req.session.currentUser) {
      res.redirect('/login');
  } else {
      next();
  }
};

module.exports = isLoggedIn;