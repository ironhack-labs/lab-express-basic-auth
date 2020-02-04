module.exports = function exposeLoginStatus(req, res, next) {
  if (!req.session.currentUser) {
    res.locals.currentUser = undefined;
    res.locals.isLoggedIn = false;
    res.locals.isAdmin = false;
  } else {
    res.locals.currentUser = req.session.currentUser;
    res.locals.isLoggedIn = true;
    res.locals.isAdmin = req.session.currentUser.role === "admin";
  }
  next();
};
