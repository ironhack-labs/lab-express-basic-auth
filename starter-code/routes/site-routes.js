var express = require('express');
var siteRoutes = express.Router();

/* GET home page. */
siteRoutes.get('/', function(req, res, next) {
  res.render('index');
});



//Check if user is valid to go to welcome or not (if logged in).
siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("main");
  }
});

siteRoutes.get("/private", (req, res, next) => {
  res.render("private");
});




module.exports = siteRoutes;
