const express = require("express");
const User = require("../models/User");
const bcrypt = requiere("bcrypt")
const router = express.Router();

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, salt);

  try {
    const user = await User.create({ username, password: hashPassword });
    res.render("index", { user });
  } catch (e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", {});
});

router.post("/login", (req, res, next) => {});

module.exports = router;
