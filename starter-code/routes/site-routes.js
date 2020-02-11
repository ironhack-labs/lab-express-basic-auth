var express = require("express");
var siteRouter = express.Router();

siteRouter.use((req, res, next) => {
  if (req.session.currentUser) next();
  else res.redirect("/login");
});

siteRouter.get("/main", (req, res) => {
  res.render("auth/main");
});

siteRouter.get("/privatec", (req, res) => {
  res.render("auth/private");
});

module.exports = siteRouter;
