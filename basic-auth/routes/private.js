const express = require("express");
const privateRoute = express.Router();

privateRoute.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

privateRoute.get("/", (req, res, next) => {
  console.log("!!");
  res.render("auth/private");
});

module.exports = privateRoute;