const express    = require("express");
const siteRoutes = express.Router();

siteRoutes.get("/", (req, res, next) => {
  res.render("index");
});

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

module.exports = siteRoutes;