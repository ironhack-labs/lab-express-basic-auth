//Keeping the middleware functions in a separate file allows us to create it only once and use it
// anywhere in our app.

// function checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    //if unauthenticated, needs to login
    return res.redirect("/login");
  }
  //next used for next middelware/route
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    //user is logged in
    return res.redirect("/");
  }
  next();
};
//To utilize middleware functions, we need first to make them available in the routes file.
// As we exported the isLoggedIn and isLoggedOut functions, we should import them wherever we want to use them.
module.exports = {
  isLoggedIn,
  isLoggedOut,
};
