module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    console.log("Luci")
    res.redirect("/login");
  }
};

module.exports.isNotAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/profile");
  } else {
    next();
  }
};
