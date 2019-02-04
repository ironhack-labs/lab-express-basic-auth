const express = require("express");
const authRoutes = express.Router();

authRoutes.get("/", (req, res, next) => {
  res.render("home");
});

authRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("auth/login");
  }
});

authRoutes.get("/private", (req, res, next) => {
  res.render("auth/private");
});

authRoutes.get("/main", (req, res, next) => {
  res.render("auth/main");
});

module.exports = authRoutes;
