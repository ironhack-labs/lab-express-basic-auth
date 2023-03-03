// checks if the user is logged in when trying to access a specific page if not logged in will redirect to the login page

const isLoggedIn = function (req, res, next) {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
};

// if a logged used tries to access the login page it
// redirects the user to the home page
const isLoggedOut = function (req, res, next) {
    if (req.session.currentUser) {
        return res.redirect("/");
      }
      next();
};

module.exports = {
    isLoggedIn,
    isLoggedOut
  };