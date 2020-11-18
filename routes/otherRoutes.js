const express = require("express");
const router = express.Router();

const userShouldBeAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
};

router.get("/main", userShouldBeAuth, (req, res) => {
  res.render("otherRoutes/main");
});

router.get("/private", userShouldBeAuth, (req, res) => {
  res.render("otherRoutes/private");
});

module.exports = router;
