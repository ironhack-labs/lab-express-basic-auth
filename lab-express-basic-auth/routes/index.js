const express = require("express");
const index = express.Router();

// User model
const User = require("../models/user");

index.get("/", (req, res, next) => {
  res.render("home");
});

let connectedMiddleware = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/");
  }
};

index.get("/secret", connectedMiddleware, (req, res, next) => {
  console.log("DEBUG req.session", req.session);
  res.render("secret");
});

index.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = index;
