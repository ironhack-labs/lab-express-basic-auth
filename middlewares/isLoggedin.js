const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect("/login");
};

module.exports = isLoggedIn;
