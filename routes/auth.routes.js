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

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  const existingUser = await User.findOne({ username: req.body.username });

  if (!existingUser) {
    console.log("No user with this username found");
    return res.render("auth/login", {
      error:
        "No user with this username found. Please try again or sign-up first",
    });
  }

  const correctPassword = await bcryptjs.compare(
    req.body.password,
    existingUser.password
  );

  if (!correctPassword) {
    console.log("Username and password don't match");
    return res.render("auth/login", {
      error:
        "Username and password don't match. Please try again or sign-up first",
    });
  }
  console.log("Username and password match!");
  req.session.currentUser = {username: existingUser.username};
  console.log("req.session.currentUser: ", req.session.currentUser)
  res.redirect("/profile");
});

router.get("/profile", async (req, res) => {
  const user = await User.findOne({ username: req.session.currentUser.username });
  console.log("user", user);
  res.render("auth/profile", user);
});

module.exports = router;
