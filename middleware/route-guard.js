const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/signup");
    return;
  }
  next();
};

module.exports = {
  isLoggedIn,
};
