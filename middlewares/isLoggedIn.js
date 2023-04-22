const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
    return;
  }

  res.redirect("/auth/login");
};

// this and the one above are the same.
// function isLoggedIn(req, res, next) {
//   if (req.session.user) {
//     next();
//     return;
//   }

//   res.redirect("/login");
// }

module.exports = isLoggedIn;