const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

// render signup page
router.get("/sign-up", (req, res, next) => {
  res.render("auth/sign-up");
});

// create new user
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
      .then((user) => {
        console.log(`New user created: ${user.username}`);
        res.render("auth/user-profile", { user });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res
            .status(500)
            .render("auth/sign-up", { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render("auth/sign-up", {
            errorMessage: `Username ${username.toLowerCase()} is already used.`,
          });
        } else {
          next(error);
        }
      });
  }
});

// get login page
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// post login page
router.post("/login", (req, res, next) => {
  const { username, pass } = req.body;
  console.log("SESSION =====> ", req.session);

  if (!username || !pass) {
    res.render("auth/login", { errorMessage: "Please fill in all fields." });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "Invalid username." });
        return;
      } else if (bcrypt.compareSync(pass, user.password)) {
        //res.render("auth/user-profile", { user });

        req.session.currentUser = user;
        console.log(req.session.currentUser);
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", { errorMessage: "Invalid password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/user-profile", isLoggedIn, (req, res, next) => {
  res.render("auth/user-profile", { userInSession: req.session.currentUser });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/login");
  });
});

// Private Main Page
router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});

// Private Gif Page

router.get("/gif", isLoggedIn, (req, res, next) => {
  res.render("gif");
});

module.exports = router;
