const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 15;
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });
    console.log("Result: " + result);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
