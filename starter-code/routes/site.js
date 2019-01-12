const express    = require("express");
const site = express.Router();
const ensureLogin = require('connect-ensure-login');



site.get("/", (req, res, next) => {
  res.render("home");
});
site.get("/home", (req, res, next) => {
  res.render("home");
});



site.get('/private', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('private', { user: req.user });
});
// site.use((req, res, next) => {
//   console.log('req.session.currentUser: ',req.session.currentUser);
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.redirect("auth/login");
//   }
// });


// site.get("/private", (req, res, next) => {
//   res.render("private");
// });
// site.get("/main", (req, res, next) => {
//   res.render("main");
// });



module.exports = site;