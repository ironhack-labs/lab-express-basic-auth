const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");
const bcrypt  = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

module.exports = authRoutes;
