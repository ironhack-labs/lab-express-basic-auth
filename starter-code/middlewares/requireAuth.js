module.exports = function (req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.render("auth/login", {
      errorMessage: "You need to sign in"
    });
  };
}