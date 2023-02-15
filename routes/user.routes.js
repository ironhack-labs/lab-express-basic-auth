const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn } = require("../middleware/route-guard");

router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    await User.create({
      username,
      password: hash,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/login", (req, res, next) => {
  res.render("user/login");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.render("user/login", {
        errorMessage: "Email not found",
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      //This will compare the plain text password from the input with the hashed password we stored in the database

      req.session.user = user;

      res.render("user/profile");
    } else {
      //If the user exists BUT the password is wrong
      res.render("auth/login", {
        errorMessage: "Wrong password. Try your birthday",
      });
    }
  } catch (err) {}
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("user/protected/main");
});
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("user/protected/private");
});

module.exports = router;
