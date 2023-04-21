const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// GET home page
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
