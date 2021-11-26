// checks if the user is logged in when trying to access a specific page
// if the user is login, then go and process the request of next(), 
// go the the route it's trying to access
// if the user is not login yet, go and redirect the user to --> login 
const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect("/login");// if the user is not loggedIn yet, go and redirect to --> login page (the user must to logged In)
    }
    next();// if the user is already Logged In, send the user to the next route he/she is trying to access.
  };
  
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect("/"); //if user has already logged In, redirect the user to home page
    }
    next(); //if the user doesnt't have a logged In, go and take him/her to the route requested
  };
  
  // export the functions to make them available to be used wherever we need them
  // (we just need to import them to be able to use them)
  
  module.exports = {
    isLoggedIn,
    isLoggedOut
  };