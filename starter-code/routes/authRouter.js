const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const { hashPassword, checkHashed } = require("../lib/hashing");

// Show the list celebrity in celebrity/index
router.get("/", async (req, res, next) => {
  res.render("auth/login");
});

router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  const existingUser = await Users.findOne({ username });

  // this user does not exist
  if (!existingUser) {
    console.log("user does not exist");
    return res.redirect("/login");
  }

  // password missmatch
  if (!checkHashed(password, existingUser.password)) {
    console.log("password missmatch");
    return res.redirect("/login");
  }

  // User login successful
  console.log(`Welcome ${existingUser.username}`);
  req.session.currentUser = existingUser;
  return res.redirect("/");
});

router.get("/logout", async (req, res, next) => {
  req.session.currentUser = null;
  return res.redirect("/");
});

module.exports = router;
