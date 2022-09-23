const router = require("express").Router();

//require user model
const User = require("../models/User.model");

//require bscryptjs
const bcrypt = require("bcryptjs");

//set salt rounds
const saltRounds = 12;

router.get("/signup", (req, res, next) => {
  res.render("createAccount");
});

router.post("/signup", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const salt = await bcrypt.genSalt(saltRounds);
  console.log(salt);

  const hash = bcrypt.hashSync(password, salt);
  console.log(hash);

  const newUser = new User({ email, password: hash });

  await newUser.save();
  res.redirect("/");
});

module.exports = router;

