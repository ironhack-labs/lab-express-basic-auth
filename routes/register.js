const router = require("express").Router();
const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

router.get("/", (req, res, next) => {
  res.render("./register");
});

router.post("/", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  const salt = bcrypt.genSaltSync(saltRounds);

  const hashedPassword = bcrypt.hashSync(password, salt);

  User.create({ username: username, password: hashedPassword });

  res.redirect("./register");
});

module.exports = router;
