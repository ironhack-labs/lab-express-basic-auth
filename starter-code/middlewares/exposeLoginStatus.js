module.exports = function exposeLoginStatus(req, res, next) {
  if (!req.session.currentUser) {
    res.locals.currentUser = undefined;
    res.locals.isLoggedIn = false;
  } else {
    res.locals.currentUser = req.session.currentUser;
    res.locals.isLoggedIn = true;
  }
  next();
};
