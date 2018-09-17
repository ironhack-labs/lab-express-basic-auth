const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/main", (req, res, next) => {
  res.render("./private/main")
});

router.get("/private", (req, res, next) => {
  res.render("./private/private")
});

module.exports = router;