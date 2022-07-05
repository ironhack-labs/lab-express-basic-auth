// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    next();
  };
   
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/profile');
      //here the user is logged in that's why he is
      //redirected to the profile page
      //false cases come first
    }
    next();
  };
   
  module.exports = {
    isLoggedIn,
    isLoggedOut
  };