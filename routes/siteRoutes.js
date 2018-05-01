const express = require("express");
const siteRoutes = express.Router();

siteRoutes.get("/", (req, res, next) => {
  res.render("/");
});

siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

siteRoutes.get("/secret", (req, res, next) => {
  const username = {}
  res.render("site/secret");
});

module.exports = siteRoutes;