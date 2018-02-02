const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET Signup Page */
router.get("/signup", function(req, res, next) {
  res.render("auth/signup", { title: "Signup" });
});

/* POST username y password */
router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  // let salt     = bcrypt.genSaltSync(bcryptSalt);
  // let hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username,
      password: hashPass
    });

    newUser.save(err => {
      res.redirect("/signup");
    });
  });
});
module.exports = router;
