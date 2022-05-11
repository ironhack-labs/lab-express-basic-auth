const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});

module.exports = router;
