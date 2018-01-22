const express = require("express");
const authRoutes = express.Router();

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

module.exports = authRoutes;
