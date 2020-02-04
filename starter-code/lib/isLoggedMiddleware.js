const isLoggedIn = (renderRoute = "auth/login") => (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    return res.render(renderRoute, {errorMessage: "Log in first"});
  }
};

const isLoggedOut = (redirectRoute = "/") => (req, res, next) => {
  if (!req.session.currentUser) {
    return next();
  } else {
    return res.redirect(redirectRoute);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};