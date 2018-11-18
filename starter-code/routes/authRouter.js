const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate an username and a password"
    });
    return;
  } else {
    User.findOne({"username": username}, "username",
      (err, user) => {
        if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists"
          });
          return;
        }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = User({
        username,
        password: hashPass
      });
      newUser.save((err) => {
        res.redirect("/");
      });
    });
  }
});

module.exports = router;
