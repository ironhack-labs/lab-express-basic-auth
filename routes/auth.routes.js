const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 12;

router.get("/signup", (req, res) => {
  console.log("render succesful");
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const salt = await bcryptjs.genSalt(saltRounds);
  const hash = await bcryptjs.hash(req.body.password, salt);
  console.log(hash);

  const user = new User({ username: req.body.username, password: hash });
  console.log(user);
  await user.save();

  res.send("signed up");
});

module.exports = router;
