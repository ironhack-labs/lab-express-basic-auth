const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.render("login", { errorMessage: "Inicia sesión por favor." });
    return;
  }
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/personal-page");
  } else {
    next();
  }
};

module.exports = { isLoggedIn, isLoggedOut };
