const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
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

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }
  if (!username || !email || !password) {
    res.render("auth/signup", { errorMessage: "All fields are needed" });
  }

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
      res.redirect("/user-profile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log(error);
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

module.exports = router;
