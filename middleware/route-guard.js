const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/inicio-sesion");
    return;
  }
  next();
};

// const isLoggedIn = (req, res, next) =>
//   req.session.currentUser ? next() : res.render("forbidden");

module.exports = { isLoggedIn };
