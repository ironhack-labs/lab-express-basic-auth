const express = require("express");
const privateRouter = express();
const User = require("../models/User.model");

const isLoggedOut = require("../middlewares/isLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedOut");

privateRouter.get("/private", isLoggedIn, (req, res) => {
  res.render("private");
});

module.exports = privateRouter;
