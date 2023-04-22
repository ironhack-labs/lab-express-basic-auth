const isLoggedOut = (req, res, next) => {
  if (!req.session.user) {
    next();
    return;
  }

  res.redirect("/profile");
};

module.exports = isLoggedOut;
