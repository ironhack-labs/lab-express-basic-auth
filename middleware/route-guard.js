function isLoggedIn(req, res, next) {
  //check if user is logged in
  if (!req.session.user) {
    return res.redirect("/auth/login")
  }
  next()
}

function isLoggedOut(req, res, next) {
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};


module.exports = {
  isLoggedIn, isLoggedOut
}
