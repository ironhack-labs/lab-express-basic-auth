const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const router = require("express").Router();

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcryptjs.genSalt(saltRounds);
    const hash = await bcryptjs.hash(password, salt);
    await User.create({ email, password: hash });
    res.redirect("/userProfile");
  } catch (err) {
    res.render("error");
  }
});

router.get("/userProfile", (req, res) => res.render("user-profile"));

module.exports = router;
