const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    /* const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // Minimum eight characters, at least one letter and one number

     if (!regex.test(password)) {
      res.render("auth/signup", {
        errorMessage:
          "Please input a password with a minimum eight characters, at least one letter and one number",
      });
    } */

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ email, password: hashedPassword });

    res.redirect("/");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.render("auth/signup", {
        errorMessage: error.message,
      });
    } else if (error.code === 11000) {
      res.render("auth/signup", {
        errorMessage: "Email is already in use",
      });
    }
    console.log(error);
    next(error);
  }
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!password || !email) {
      res.render("auth/login", { errorMessage: "Please input all the fields" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      res.render("auth/login", { errorMessage: "Account does not exist" });
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;

      res.redirect("/profile");
    } else {
      res.render("auth/login", { errorMessage: "Wrong credentials" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/main", isLoggedOut, (req, res, next) => {
  res.render("main");
});

router.get("/private", isLoggedOut, (req, res, next) => {
  res.render("private");
});

router.get("/profile", isLoggedIn, (req, res) => {
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
