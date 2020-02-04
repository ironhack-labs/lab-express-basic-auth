const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { hashPassword, checkHashed } = require("../lib/hashing");

router.get("/register", async (req, res, next) => {
  res.render("auth/register");
});

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    console.log(`The User: ${existingUser.username} is already exists!`);
    return res.redirect("/auth/register");
  } else {
    const newUser = await User.create({
      username,
      password: hashPassword(password)
    });
    return res.redirect("/");
  }
});

router.get("/login", async (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    console.log(`User: ${existingUser.username} doesn't exists `);
    return res.redirect("/auth/login");
  }
  if (!checkHashed(password, existingUser.password)) {
    console.log("Password missmatch");
    return res.redirect("auth/login");
  }
  console.log(`Welcome ${existingUser.username}`);
  req.session.currentUser = existingUser;
  return res.redirect("/");
});

router.get("/logout", async (req, res, next) => {
  req.session.currentUser = null;
  return res.redirect("/");
});

module.exports = router;
