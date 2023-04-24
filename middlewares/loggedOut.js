const isLoggedOut = (req, res, next) => {
    if (!req.session.user) {
      next();
      return;
    }
  
    res.redirect("/login");
  };
  
  module.exports = isLoggedOut;