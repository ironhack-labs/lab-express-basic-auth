const router = require("express").Router();
const { isLoggedIn } = require("../middleware/route-guard");
const { route } = require("../app");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "") return res.render("signup", { message: "Username not specified." });
  if (password === "") return res.render("signup", { message: "Password not specified." });
  if (password.length < 5) return res.render("signup", { message: "Password must be at least 5 characters long." });

  User.findOne({ username }).then((found) => {
    if (found) return res.render("signup", { message: "Username already exists." });

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    User.create({ username, password: hash })
      .then((user) => res.redirect("/"))
      .catch((err) => next(err));
  });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) return res.render("login", { message: "Username not found." });

      if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.render("profile", { user });
      } else {
        res.render("login", { message: "Incorrect password." });
      }
    })
    .catch((err) => next(err));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});

module.exports = router;
