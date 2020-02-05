module.exports = function loginStatus(req, res, next) {
  console.log("middleware")
  if (!req.session.currentUser) {
    console.log("fff")
    res.locals.currentUser = undefined;
    res.locals.isLoggedIn = false;
    res.locals.isAdmin = false;
  } else {
    console.log("lll")
    res.locals.currentUser = req.session.currentUser;
    res.locals.isLoggedIn = true;
  }
  next();
};