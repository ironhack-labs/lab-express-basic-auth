const express = require("express");
const router = express.Router();

router.get("/home", (req, res, next) => {
  res.render("home");
});

router.get("/private", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;
