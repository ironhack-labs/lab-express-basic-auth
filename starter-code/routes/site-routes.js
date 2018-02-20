const express = require("express");
const siteRoutes = express.Router();



// middleware to protect secret page
siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    // if user session is going and authorized to view page - then proceed.
    next();
  } else {
    res.redirect("/login"); // otherwise go back to login
  }
});


// route to handle view for secret page
siteRoutes.get("/", (req, res, next) => {
  res.render("secret");
});


// private page
siteRoutes.get("/private", (req, res, next) => {
  res.render("private");
});


// main page (cat)
siteRoutes.get("/main", (req, res, next) => {
  res.render("main");
});





module.exports = siteRoutes;
