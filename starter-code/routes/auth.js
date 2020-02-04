const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  return res.render("auth/signup", { messages: req.flash("error") });
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username.length || !password.length) {
    req.flash("error", "Please, fill all the fields");
    return res.redirect("/signup");
  }

  try {
    const newUser = await User.findOne({ username });

    if (newUser) {
      req.flash("error", "Username already exits");
      return res.render("auth/signup", { messages: req.flash("error") });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    await User.create({ username, password: hashPass });
    return res.redirect("/");
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username.length || !password.length) return res.render("auth/login");

  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error", "User does not exist");
      return res.render("auth/login", { messages: req.flash("error") });
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      return res.redirect("/");
    } else {
      req.flash("error", "Wrong password");
      return res.render("auth/login", { messages: req.flash("error") });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(e => res.redirect("/"));
});

module.exports = router;
