const express    = require("express");
const site = express.Router();



site.get("/", (req, res, next) => {
  res.render("home");
});
site.get("/home", (req, res, next) => {
  res.render("home");
});

site.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});


site.get("/private", (req, res, next) => {
  res.render("private");
});
site.get("/main", (req, res, next) => {
  res.render("main");
});



module.exports = site;