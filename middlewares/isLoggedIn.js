const isLoggedIn = (req, res, next) => {
  if (req.session.username) {
    next();
    return;
  }

  res.redirect("/auth/login");
};

module.exports = isLoggedIn;
