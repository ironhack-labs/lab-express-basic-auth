const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

router.get("/main", (req, res, next) => {
  let session = req.session.loggedInUser;
  if (!session) {
    res.redirect("/login");
  } else {
    res.render("main.hbs");
  }
});
router.get("/private", (req, res, next) => {
  let session = req.session.loggedInUser;
  if (!session) {
    res.redirect("/login");
  } else {
    res.render("private.hbs");
  }
});

module.exports = router;
