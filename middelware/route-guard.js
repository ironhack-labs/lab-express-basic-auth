const isLoggedIn = (req, res, next) => {
  if (!req.session.currentuser) {
    // return res.redirect("/login");
    return res.render("auth/notLoggedIn");
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentuser) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
