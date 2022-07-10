const isLoggedIn = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  req.user = req.session.currentUser;
  next();
};

const isLoggedOut = (req, res, next) => {
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  if (req.session.currentUser) {
    return res.redirect("/userProfile");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
