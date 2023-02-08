function isLoggedIn(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    return res.redirect("/login");
  }

  // User is logged in => Open requested page
  next();
}

module.exports = { isLoggedIn };
