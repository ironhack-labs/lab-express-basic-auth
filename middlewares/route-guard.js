// middleware/route-guard.js

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
  // Same as
  // if(req.session.currentUser){
  //     next()
  // }
  // else{
  //     res.redirect('/login');
  // }
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

// User model
//   {
//     username,
//     email,
//     password,
//     role: ['Super Admin','Admin', 'Regular']
//   }

// isAdmin
// if(req.session.currentUser && req.session.currentUser.role === 'Admin'){}

const canYouSeeIt = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.render("auth/login", {
      errorMessage: "You need to sign in first.",
    });
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  canYouSeeIt,
};
