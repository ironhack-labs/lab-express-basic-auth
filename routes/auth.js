const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const User = require("../models/User.model");

const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/user-profile", (req, res, next) => {
  res.render("users/user-profile");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((createdUser) => {
      res.redirect("users/user-profile");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
