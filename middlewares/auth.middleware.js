//para saber si esta autenticado/logeado

module.exports.isAuthenticated = (req, res, next) => {
  if (req.currentUser) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

module.exports.isNotAuthenticated = (req, res, next) => {
  if (!req.currentUser) {
    next();
  } else {
    res.redirect("/user/profile");
  }
};
