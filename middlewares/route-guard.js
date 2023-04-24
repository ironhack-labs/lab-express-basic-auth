// middleware/route-guard.js

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (req.session.userFromDatabase) {
    next();
    return;
  }
  res.redirect("/profile");
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (!req.session.userFromDatabase) {
    next();
    return;
  }
  res.redirect("/auth/login");
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
