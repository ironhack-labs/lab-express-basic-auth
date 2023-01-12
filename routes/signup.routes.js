const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const saltRounds = 10;

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({ username, password: hashedPassword });
    })
    .then((user) => {
      console.log("A new user was signed up: ", user);

      res.redirect("/profile");
    })
    .catch((error) => {
      console.log("An error occured while signing up a user: ", error);
    });
});

router.get("/signup", (req, res) => {
  res.render("user/user-signup");
});

module.exports = router;
