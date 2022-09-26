const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 12;

const {
  ensureUserIsLoggedOut,
  ensureUserIsLoggedIn,
  ensureUserIsSubscribed,
} = require("../middlewares/loginChecks");

const router = require("express").Router();

router.get("/signup", ensureUserIsLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcryptjs.genSalt(saltRounds);
  console.log(salt);

  const hash = await bcryptjs.hash(password, salt);
  console.log(hash);

  const newUser = new User({ email, password: hash });
  await newUser.save();
  res.redirect("/profile");
});

router.post("/login", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser) {
    return res.render("auth/login", {
      error: "Incorrect Credentials!",
    });
  }
  const passwordIsCorrect = await bcryptjs.compare( req.body.password, existingUser.password );

  if (!passwordIsCorrect) {
    return res.render("auth/login", { error: "there was an error logging in" });
  }

  req.session.currentUser = { email: existingUser.email, subscribed: existingUser.subscribed, };
  return res.redirect("/profile");
});

router.get("/profile", ensureUserIsLoggedIn, async (req, res) => {
  const user = await User.findOne({ email: req.session.currentUser.email });
  res.render("profile/profile", { name: user.name });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

router.get("/main", (req, res) => {
  res.render("profile/main");
});

router.get("/private", ensureUserIsLoggedIn, ensureUserIsSubscribed,
  (req, res) => {
    res.render("profile/private");
  }
);

module.exports = router;