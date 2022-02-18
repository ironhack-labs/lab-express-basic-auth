const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User.model");
const { isLoggedIn } = require('../middleware/route-guard');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private", { user: req.session.currentUser });
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds).then((hash) => {
    User.create({
      username,
      password: hash,
    })
      .then((userDB) => {
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.render("/login", { errorMessage: "user not found" });
    } else if (bcrypt.compare(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("/login", { errorMessage: "Login Failed" });
    }
  });
});

router.get("/logout", (req, res, next) => {
  // req.logout();
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
