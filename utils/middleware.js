function isLoggedIn(req, res, next) {
  if (req.session.currentUser) {
    // if user has an authenticated cookie
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = {
  isLoggedIn,
};
