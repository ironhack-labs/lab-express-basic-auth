const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
// const { PromiseProvider } = require("mongoose");
const saltRounds = 10;
const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));

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

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", async (req, res) => {
  console.log("SESSION =========>", req.session);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("auth/login", {
      errorMessage: "Please provide both email and password",
    });
  }

  const existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser) {
    return res.render("auth/login", {
      errorMessage: "Email is not registed. Try with other email.",
    });
  }

  const passwordIsCorrect = await bcryptjs.compare(
    req.body.password,
    existingUser.password
  );

  if (!passwordIsCorrect) {
    return res.render("auth/login", { errorMessage: "Incorrect password" });
  }

  req.session.currentUser = existingUser;
  res.redirect("/userProfile");
});

router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/login");
  });
});

module.exports = router;
