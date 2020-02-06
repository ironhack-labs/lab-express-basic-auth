const isLoggedIn = (redirectRoute = "/login") => (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    req.flash("This is protected, please login first");
    return res.redirect(redirectRoute);
  }
};

const isLoggedOut = (redirectRoute = "/") => (req, res, next) => {
  if (!req.session.currentUser) {
    return next();
  } else {
    req.flash("You are already logged in");
    return res.redirect(redirectRoute);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};
