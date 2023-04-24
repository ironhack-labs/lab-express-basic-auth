const isLoggedOut = (req, res, next) => {
    if (!req.session.user) {
      next();
      return;
    }
  
    res.redirect("/views/profile");
  };
  
  module.exports = isLoggedOut;