const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.get("/profile", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("profile");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
