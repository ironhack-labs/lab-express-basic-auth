const bcrypt = require("bcryptjs");
const saltRounds = 10;
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res) => res.render("index"));

//GET:

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//POST:

router.post("/signup", async (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;

  const errors = {};

  if (!username || typeof username !== "string" || username.length > 50) {
    errors.username = "Username is required and should be 50 characters max";
    res.render("auth/signup", {
      errorMessage: "Username is required and should be 50 characters max",
      username: true,
    });
  }

  if (
    !password ||
    !password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    )
  ) {
    errors.password =
      "Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character";
    res.render("auth/signup", {
      errorMessage:
        "Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character",
      password: true,
    });
  }

  if (Object.keys(errors).length) {
    res.render("auth/signup", errors);
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPass = await bcrypt.hash(password, salt);
    console.log("hashpass =>", hashPass);

    const result = await User.create({ username, passwordHash: hashPass });

    res.redirect("/login");
    console.log(result);
  } catch (err) {
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: err.message });
    } else if (err.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Username and password need to be unique. Either username or password is already used.",
      });
    }
  }
});

//GET login:

router.get("/login", (req, res) => res.render("auth/login"));

//POST login:

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

//GET profile:

router.get("/profile", (req, res) => {
  console.log("session", req.user);

  if (!req.user || !req.user._id) {
    return res.redirect("/login");
  }
  return res.render("auth/profile", req.user);
});

//GET logout:

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
