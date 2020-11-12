const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");

const router = new Router();
const saltRounds = 10;

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  // Validate that incoming data is not empty.
  if (!username || !password) {
    res.render("auth/signup", {
      username,
      errorMessage:
        "All fields are mandatory. Please provide your name, email and password.",
    });
    return;
  }

  // Strong password pattern.
  const strongPasswordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  // Validate that incoming password matches regex pattern.
  if (!strongPasswordRegex.test(password)) {
    res.status(500).render("auth/signup", {
      username,
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcrypt
    .hash(password, saltRounds)
    // Create new user with the hashed password
    .then((hashedPassword) => {
      User.create({ username, password: hashedPassword })

        .then((newUser) => {
          req.session.user = newUser;
          res.redirect("/user-profile");
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render("auth/signup", {
              username,
              validationError: error.message,
            });
          } else if (error.code === 11000) {
            res.status(500).render("auth/signup", {
              username,
              errorMessage: "Username needs to be unique. Already in use.",
            });
          } else {
            next(error);
          }
        });
    })
    .catch((err) => next(err));
});

// 4. GET route ==> to render the profile page of the user.
router.get("/user-profile", (req, res) => {
  res.render("users/user-profile", { user: req.session.user });
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", {
      username,
      errorMessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return;
  }

  // find user and send correct response
  User.findOne({ username })
    .then((user) => {
      // check if found user was an object or null
      if (!user) {
        res.render("auth/login", {
          username,
          errorMessage: "Username is not registered. Try with other username.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", {
          username,
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((error) => next(error));
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/main", checkUserStatus, (req, res) => {
  res.render("users/main");
});

router.get("/private", checkUserStatus, (req, res) => {
  res.render("users/private");
});

function checkUserStatus(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
