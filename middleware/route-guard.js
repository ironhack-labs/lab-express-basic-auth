// middleware/route-guard.js

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/login');
  }
  //  this passes on to the next middleware if the condition is not met
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

// these will be keys assigned to these names
module.exports = {
  isLoggedIn,
  isLoggedOut,
};
