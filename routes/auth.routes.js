const { Router } = require("express");
const router = new Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

//GET SIGNUP
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//GET USERPROFILE
router.get("/profile", (req, res) => {
  res.render("users/user-profile", { user: req.session.currentUser });
});

//POST SIGNUP
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render("auth/signup", { errorMessage: "Please fill in all fields." });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

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
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: err.message });
      } else if (err.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

//GET LOGIN
router.get("/login", (_, res) => {
  res.render("auth/login");
});

//POST LOGIN
router.post("/login", (req, res, next) => {
  //   console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", { errorMessage: "Please fill in all the fields" });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "Email does not exist" });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // res.render("users/user-profile", { user });
        req.session.currentUser = user;
        res.redirect("/auth/profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password" });
      }
    })
    .catch((err) => next(err));
});

//POST LOGOUT
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
