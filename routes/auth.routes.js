const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/login", isLoggedOut, (req, res, next) => res.render("auth/login"));

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    /* if (!email || !password) {
      res.render("auth/login", {
        errorMessage: "All the fields are mandatory.",
      });
      return;
    } */
    const user = await User.findOne({ username });

    if (!user) {
      res.render("auth/login", {
        errorMessage: "Username not found",
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect("/profile");
    } else {
      res.render("auth/login", {
        errorMessage: "Wrong password",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/profile", isLoggedIn, (req, res) => {
  const user = req.session.user;
  res.render("profile", user);
});

router.post("/logout", (req, res, next) => {
  if (!req.session) res.redirect("/");
  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});

module.exports = router;
