const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
    return;
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/profile");
    return;
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
