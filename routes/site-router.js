const express = require("express");
const siteRouter = express.Router();

function hasACookie(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}

siteRouter.get("/main", hasACookie, (req, res, next) => {
  res.render("main");
});

siteRouter.get("/private", hasACookie, (req, res, next) => {
  res.render("private");
});

module.exports = siteRouter;
