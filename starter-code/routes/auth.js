const express = require("express");
const router = express.Router();
const User = require("../models/user-schema");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
router.get("/signup", (req, res) => {
  res.render("index");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  console.log("Entra");
  const newUser = User({
    username,
    password: hashPass
  });

  newUser
    .save()
    .then(user => {
      res.redirect("/auth/signup");
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
