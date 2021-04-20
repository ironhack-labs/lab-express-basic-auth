const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (password.length < 8) {
    res.render("signup", {
      message: "Your Password must be at least 8 characters long",
    });
    return;
  }

  if (username.length === 0) {
    res.render("signup", { message: "Please enter your username" });
    return;
  }

  User.findOne({ username: username }).then((user) => {
    if (user !== null) {
      res.render("signup", {
        message: "The username is already in the database",
      });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash }).then((user) =>
        res.redirect("/")
      );
    }
  });
});

module.exports = router;
