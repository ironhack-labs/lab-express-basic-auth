const express = require("express");
const mainRouter = express();
const User = require("../models/User.model");

const isLoggedOut = require("../middlewares/isLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedOut");

mainRouter.get("/main", isLoggedIn, (req, res) => {
  const name = req.session.currentUser.username;
  res.render("main", { name });
});

module.exports = mainRouter;
