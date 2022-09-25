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
  res.render("profile");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser) {
    console.log("No matching email");
    return res.render("login", {
      error: "Please sign up first",
    });
  }

  const correctPw = bcrypt.compare(req.body.password, existingUser.password);

  if (!correctPw) {
    return res.render("login", {
      error: "We cannot log you in due to an error. Please try again next week.",
    });
  }

  req.session.currentUser = {
    email: existingUser.email,
  };

  return res.redirect("/profile");
});

router.get("/profile", async (req, res) => {
  const user = await User.findOne({ email: req.session.currentUser.email });

  res.render("profile");
});

module.exports = router;
