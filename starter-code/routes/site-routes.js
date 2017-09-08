var express = require('express');
var siteRoutes = express.Router();

/* GET home page. */
siteRoutes.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = siteRoutes;

//iteration 3: create private page
siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

siteRoutes.get("/private", (req, res, next) => {
  res.render("private");
});
