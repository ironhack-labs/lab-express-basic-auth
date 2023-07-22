const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("../views/auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((registeredUser) => {
      res.redirect("/userProfile");
    })
    .catch((error) => {
        console.log(error)
    })
});

router.get("/userProfile", (req, res) => 
res.render("../views/users/user-profile.hbs"));

module.exports = router;
