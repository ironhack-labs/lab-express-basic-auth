var express = require("express");
var privateRouter = express.Router();

privateRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

privateRouter.get("/", (req, res) => {
  res.render("main", { username: req.session.currentUser.username });
});

privateRouter.get("/private", (req, res) => {
  res.render("private");
});

module.exports = privateRouter;
