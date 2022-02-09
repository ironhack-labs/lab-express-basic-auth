const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.render("login", {
      message: "you were not logged in ! please do so now.",
    });
  }
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
