const isLoggedIn = (req, res, next) => {
  if (!req.session.currentuser) {
    return res.redirect("/auth/login");
  }
  next();
};

module.exports = isLoggedIn