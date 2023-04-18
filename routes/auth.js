const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();
const saltRounds = 12;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  // const{email,password} = req.body;

  const salt = await bcryptjs.genSalt(saltRounds);
  console.log(salt);

  const hash = await bcryptjs.hash(req.body.password, salt);
  console.log(hash);

  const newUser = new User({ username: req.body.username, password: hash });
  console.log(newUser);
  await newUser.save();

  res.redirect("/profile");
});

// router.get("/profile", (req, res) => {
//   res.render("auth/profile");
// });

module.exports = router;
