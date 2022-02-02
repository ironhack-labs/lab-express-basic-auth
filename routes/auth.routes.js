const router = require("express").Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", (req, res) => {
  res.render("../views/auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  // make sure users fill all mandatory fields:
  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((passwordHash) => {
      return User.create({ username, passwordHash });
    })
    .then((newUser) => res.redirect("/userProfile"))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username needs to be unique. Username is already used.",
        });
      } else {
        next(error);
      }
    });
});

router.get("/userProfile", (req, res) => {
  console.log(req.session.currentUser);
  res.render("../views/users/user-profile", {
    userInSession: req.session.currentUser,
  });
});

router.get("/signin", (req, res) => {
  res.render("../views/auth/signin.hbs");
});

router.post("/signin", (req, res, next) => {
  const { username, password } = req.body;
  // make sure users fill all mandatory fields:
  if (!username || !password) {
    res.render("auth/signin", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/signin", {
          errorMessage: "Username is not registered. Try with other username.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/signin", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.post("/signout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

router.get("/main", (req, res, next) => {
  res.send("Not private page");
});

router.get("/private", (req, res, next) => {
  if (req.session.currentUser) res.send("Private page accessed");
  else {
    res.send("You have to login to see this page");
  }
});

module.exports = router;
