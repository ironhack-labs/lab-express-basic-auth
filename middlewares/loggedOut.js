const isLoggedOut = (req, res, next) => {
    if (!req.session.user) {
      next();
      return;
    }
  
    res.redirect("/views/index.hbs");
  };
  
  module.exports = isLoggedOut;