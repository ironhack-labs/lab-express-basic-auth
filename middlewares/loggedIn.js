const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
      next();
      return;
    }
  
    res.redirect("/views/auth/main.hbs");
  };
  
  module.exports = isLoggedIn;