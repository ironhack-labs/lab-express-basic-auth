const express 	   = require("express");
const privateRoutes       = express.Router();

privateRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/");
  }
});

privateRoutes.get('/',(req, res, next) => {
    res.render('welcome');
});

module.exports = privateRoutes;
