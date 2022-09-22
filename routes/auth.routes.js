const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const saltRounds = 12;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = await bcryptjs.genSalt(saltRounds);
    const hash = await bcryptjs.hash(password, salt);
    console.log("Salt: ", salt, "Hash: ", hash);
    const newUser = new User({ username, password: hash });
    await newUser.save();
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
  }
});

router.get("/profile", (req, res) => {
  res.render("auth/profile");
});

module.exports = router;
