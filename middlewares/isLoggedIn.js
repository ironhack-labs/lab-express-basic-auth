const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    return res.redirect("/auth/signin");
  }
};

module.exports = isLoggedIn;
