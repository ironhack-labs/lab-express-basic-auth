const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//Signup Route
router.get("/main", (req, res) => res.render("auth/signup"));

router.post("/main", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup", {
        errorMessage: "Please insert all the fields",
      });
    }

    /*     // Check the password
    //regEx
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    //the test method is from js and can be used with regex
    if (!regex.test(password)) {
      res.render("auth/signup", {
        errorMessage:
          "Your password needs to be 8 characters long and include lowercase letters and uppercase letters",
      });
    } */

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });

    res.redirect("/");
  } catch (error) {
    //Catch mongoose errors
    if (error instanceof mongoose.Error.ValidationError) {
      res.render("auth/signup", {
        errorMessage: error.message,
      });
    } else if (error.code === 11000) {
      res.render("auth/signup", {
        errorMessage: "Username is already registered",
      });
    }
    console.log(error);
    next(error);
  }
});

// Login Route
router.get(
  "/login",
  /* isLoggedOut , */ (req, res) => res.render("auth/login")
);

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!password || !username) {
      res.render("auth/login", {
        errorMessage: "Please insert all the fields",
      });
    }

    //check if the username exists

    let user = await User.findOne({ username });
    console.log(user);

    if (!user) {
      res.render("auth/login", { errorMessage: "Account does not exist" });
    } else if (bcrypt.compareSync(password, user.password))
      //the user can  now login
      //this saves the user in the session
      req.session.currentUser = user.toObject();

    res.redirect("/private");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/private", isLoggedIn, (req, res) => {
  let user = req.session.user;

  res.render("profile", user);
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});

module.exports = router;
