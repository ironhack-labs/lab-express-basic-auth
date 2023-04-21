// const isLoggedIn = (req, res, next) => {
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.render("auth/login-form", {
//       errorMessage: "Para acceder, inicia sesión",
//     });
//     return;
//   }
// };

// const isLoggedOut = (req, res, next) => {
//   if (req.session.currentUser) {
//     res.redirect("/auth/profile");
//   } else {
//     next();
//   }
// };

// module.exports = { isLoggedIn, isLoggedOut };

const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/auth/log-in");
  }
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
