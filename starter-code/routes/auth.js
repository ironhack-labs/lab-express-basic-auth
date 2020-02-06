const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const { hashPassword, checkHashedPassword } = require("../lib/hashing");

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

  // If user already logged-in
  if (req.session.currentUser) {
      return res.redirect('/');
  }

  res.render("auth/login", {});
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  // If user doesn't exist
  if (!existingUser) {
    console.log("MESSAGE: User does not exist");
    return res.redirect("/auth/login");
  }

  // If password missmatch
  if (!checkHashedPassword(password, existingUser.password)) {
    console.log("MESSAGE: Password missmatch");
    return res.redirect("/auth/login");
  }

  // Successful login
  console.log(`User ${existingUser.username}, has logged in succesfully`);
  req.session.currentUser = existingUser;
  return res.redirect("/");
});

router.get("/logout", async (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;
