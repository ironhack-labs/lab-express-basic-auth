function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // User is logged in => Open requested page
  next();
}

module.exports = { isLoggedIn };
