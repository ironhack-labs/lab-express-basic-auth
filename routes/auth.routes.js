const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

//render signup page
router.get("/sign-up", (req, res, next) => {
  res.render("auth/sign-up").catch((err) => next(err));
});

router.post("/sign-up", (req, res, next) => {
  const { username, pass } = req.body;

  // check if user is already taken
  if (!username || !pass) {
    res.render("auth/sign-up", { errorMessage: "Please fill in all fields." });
  } else {
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(pass, salt))
      .then((hashPass) => {
        return User.create({
          username: username.toLowerCase(),
          password: hashPass,
        });
      })
      .then((newUser) => {
        console.log(newUser);
        res.redirect("/user-profile");
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res
            .status(500)
            .render("auth/sign-up", { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render("auth/sign-up", {
            errorMessage: `Username ${username} is already used.`,
          });
        } else {
          next(error);
        }
      });
  }
});

router.get("/user-profile", (req, res, next) => {
  res.render("auth/user-profile");
});

module.exports = router;
