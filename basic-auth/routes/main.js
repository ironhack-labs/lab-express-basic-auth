const express = require("express");
const mainRoute = express.Router();

mainRoute.get("/", (req, res, next) => {
  console.log("!!");
  res.render("auth/main");
});

module.exports = mainRoute;