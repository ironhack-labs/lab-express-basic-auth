const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.render("auth/signup", {
        errorMessage: "User already exists! Please, try again."
      });
    } else {
      const hashPassword = bcrypt.hashSync(password, salt);
      await User.create({ username, password: hashPassword });
      res.redirect("/");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", {});
});

router.post("/login", (req, res, next) => {});

module.exports = router;
