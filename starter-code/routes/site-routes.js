const express    = require("express");
const siteRoutes = express.Router();

siteRoutes.get("/", (req, res, next) => {
    res.render("index");
  });

  siteRoutes.get("/main", (req, res, next) => {
    res.render("main");
  });

  siteRoutes.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  module.exports = siteRoutes;