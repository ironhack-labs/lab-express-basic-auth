const express    = require("express");
const siteRoutes = express.Router();

siteRoutes.get("/", (req, res, next) => {
  if(req.session.currentUser==null){
    res.render("home");
  } else {
    res.render("home",req.session.currentUser);
  }
  
});

siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/auth/login");
  }
});

siteRoutes.get("/main", (req, res, next) => {
  res.render("main",req.session.currentUser);
});

siteRoutes.get("/private", (req, res, next) => {
  res.render("private",req.session.currentUser);
});

module.exports = siteRoutes;