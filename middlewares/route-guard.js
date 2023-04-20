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
