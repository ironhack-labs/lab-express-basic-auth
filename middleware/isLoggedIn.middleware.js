function isLoggedIn(req, res, next) {
  // if req session userId is truthy
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
}

module.exports = isLoggedIn;
