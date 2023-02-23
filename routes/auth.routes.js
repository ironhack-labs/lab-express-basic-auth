const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
// what those 10 mean is - difficulty
const saltRounds = 10;

//render signup page
router.get("/sign-up", (req, res, next) => {
  res.render("auth/sign-up");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
});

router.get("/user-profile", (req, res, next) => {
  res.render("auth/user-profile");
});

module.exports = router;
