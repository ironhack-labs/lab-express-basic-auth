const router = require("express").Router();
const User = require("../../models/User.model");
const bcryptjs = require("bcryptjs");
const { isLoggedIn, isLoggedOut } = require("../../middleware/guard.js");

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (bcryptjs.compareSync(req.body.password, user.hashedPassword)) {
      req.session.currentUser = user;
      res.redirect("/auth/user-profile");
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("auth/main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("auth/private");
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
