const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

const router = express.Router();

const saltRounds = 10;

/* GET home page */
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

// auth.routes.js
// the imports, get and post route remain untouched for now

router.get("/userProfile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.session.currentUser.username,
    });
    res.render("auth/profile", user);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
  // console.log("The form data: ", req.body);

  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt

    .genSalt(saltRounds)

    .then((salt) => bcrypt.hash(password, salt))

    .then((hashedPassword) => {
      return hashedPassword;
    })

    .catch((error) => next(error));

  try {
    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });
    req.session.currentUser = user;
    res.redirect("/userProfile");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.render("auth/login", { error: "Invalid login" });
      return;
    }

    if (bcrypt.compareSync(password, user.passwordHash)) {
      req.session.currentUser = user;
      res.redirect("/userProfile");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
  });
  res.redirect("/");
});

module.exports = router;
