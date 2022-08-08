function isLoggedIn(req, res, next) {
  // if req session userId is truthy ->
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }

  next();
}

module.exports = isLoggedIn;
