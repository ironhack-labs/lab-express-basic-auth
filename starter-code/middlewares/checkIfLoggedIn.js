module.exports = function(req, res, next) {
  if (req.session.user) {
    res.locals.user = req.session.user;
    res.locals.isLogged = true;
  } else {
    res.locals.user = undefined;
    res.locals.isLogged = false;
  }
  console.log(res.locals.isLogged ? "User is logged in" : "User is not logged in");
  next();
};
