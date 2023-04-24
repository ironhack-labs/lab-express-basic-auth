const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
      next();
      return;
    }
  
    res.redirect("/auth/login");
  };
  
  module.exports = isLoggedIn;
  