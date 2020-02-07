const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { hashPassword, checkHashedPassword } = require("../lib/hashing");

router.get("/signup", (req, res, next) => {
  if (req.session.currentUser) return res.redirect("/");
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const hash = hashPassword(password);
      const user = await User.create({ username, password: hash });
      req.session.currentUser = user;
      return res.redirect("/");
    }
    res.render("auth/signup", {
      errorMessage: "User already exists! Please, try again."
    });
  } catch (e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  if (req.session.currentUser) return res.redirect("/");
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !checkHashedPassword(password, user.password))
    return res.render("auth/login", {
      errorMessage: "Username/password incorrect! Please, try again."
    });

  req.session.currentUser = user;
  return res.redirect("/");
});

router.get("/logout", async (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
