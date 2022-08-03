module.exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session.currentUser) {
    next();
  } else {
    const id = req.session.currentUser.id
    res.redirect(`/profile/${id}`);
  }
};

module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
};