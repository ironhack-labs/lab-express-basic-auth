const express = require("express");
const mainRouter = express.Router();
const { isLoggedIn } = require("./../utils/middleware");

mainRouter.get("/", isLoggedIn, (req, res, next) => {
  res.render("main-page");
});

mainRouter.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private-page");
});

module.exports = mainRouter;
