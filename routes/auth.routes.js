const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup", {
        errorMessage: "Please input all the fields",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/login", {
        errorMessage: "Please input all the fields",
      });
    }
    res.redirect("/");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
