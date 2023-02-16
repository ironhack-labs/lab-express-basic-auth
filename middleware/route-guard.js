const isLoggedIn = (req, res, next) => {
  if (!req.session.user) res.redirect("/signin");
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.user) res.redirect("/");
};

module.exports = { isLoggedIn, isLoggedOut };
