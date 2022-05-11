const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedOut, isLoggedIn } = require("../middleware/route-guard");
const saltRounds = 10;

router.get("/private", isLoggedIn, (req, res, next) =>
  res.render("auth/private")
);

module.exports = router;
