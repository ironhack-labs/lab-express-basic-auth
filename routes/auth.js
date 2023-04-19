const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();
const saltRounds = 12;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/profile", (req, res) => {
  res.render("auth/profile");
});

router.post("/signup", async (req, res, next) => {
  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    console.log(salt);

    const hash = await bcryptjs.hash(req.body.password, salt);
    console.log(hash);

    // also a way of creating and saving new user:
    // const newUser = new User({ username: req.body.username, password: hash });
    // await newUser.save();

    //short way to create and save new user:
    await User.create({ username: req.body.username, password: hash });

    res.redirect("/auth/profile");
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/auth/profile");
  }
});

module.exports = router;
