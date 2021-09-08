const { Router } = require("express");
const router = new Router();

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  bcryptjs
    .genSalt(10)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((passwordHash) => {
      return User.create({ username, email, passwordHash });
    })
    .then((userCreated) =>
      res.render("users/user-profile", { user: userCreated })
    )
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
