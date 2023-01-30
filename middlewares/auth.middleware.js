
module.exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session.currentUser) {
    next();
  } else {
    res.redirect("/profile");
  }
};

module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
};

