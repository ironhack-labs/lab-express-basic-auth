//Express
const res = require("express/lib/response");
const router = require("express").Router();
//User model
const User = require("../models/User.model");
//Bcryptjs
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
//Mongoose
const mongoose = require("mongoose");

//Routes
//Loading Sign Up page
router.get("/signup", (req, res) => {
  res.render("signup/signup");
});

//Sign Up form
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  //all fields are required
  if (!username || !password) {
    res.render("signup/signup", {
      errorMessage: "All fields are mandatory!",
    });
    return;
  }

  //validating strenght of the password
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("signup/signup", {
      errorMessage:
        "Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salted) => bcryptjs.hash(password, salted))
    .then((hashPassword) => {
      return User.create({ username, password: hashPassword });
    })
    .then((createdUser) => {
      res.redirect("users/user-page");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(500)
          .render("signup/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("signup/signup", {
          errorMessage:
            "Username already registered. Please try using another username.",
        });
      } else {
        next(error);
      }
    });
});

//Loading User page
router.get("/users/user-page", (req, res) => res.render("users/user-page"));

//Log in
//Loading Log in page
router.get("/login", (req, res) => {
  res.render("login");
});

//Log in form
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("login", {
      errorMessage: "Sorry, you forgot to fill all the fields. Try again",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login", { errorMessage: "Username is not registered" });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        res.render("users/user-page", { user });
      } else {
        res.render("login", { errorMessage: "Incorrect password" });
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
