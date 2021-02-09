const express = require("express");
const siteRouter = express.Router();

const { isLoggedIn } = require("./../utils/middleware");

siteRouter.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});

siteRouter.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});
module.exports = siteRouter;
