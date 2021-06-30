const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcrypt");
const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = bcryptjs.genSaltSync();
  const hash = bcryptjs.hashSync(password, salt);
  console.log(hash);
  User.create({ username: username, password: hash })
    .then((createdUser) => {
      console.log(createdUser);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/login", (req, res) => res.render("login"));

module.exports = router;
