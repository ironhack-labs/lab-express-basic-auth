const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { loggedIn, loggedOut } = require("../middleware/route-guard");

router.get("/signup", loggedOut, (req, res) => res.render("auth/signup"));

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !password || !email) {
      res.render("auth/signup", {
        errorMessage:
          "All the fields are mandatory. Please input a username, email and password",
      });
      return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Invalid password, password needs to have at least 6 characters and include an uppercase and lowercase character",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage: " Username or email already exists",
      });
    }

    next(error);
  }
});

router.get("/login", loggedOut, (req, res) => res.render("auth/login"));

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!password || !email) {
      res.render("auth/login", {
        errorMessage:
          "All the fields are mandatory. Please input an email and password",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.render("auth/login", {
        errorMessage: "Email not found",
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect("/private");
    } else {
      res.render("auth/login", {
        errorMessage: "Password not found",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/private", loggedIn, (req, res) => {
  const user = req.session.user;
  console.log(user);

  res.render("private", user);
});

router.get("/main", loggedIn, (req, res) => {
  const user = req.session.user;
  console.log(user);

  res.render("main", user);
});

router.get("/private", loggedIn, (req, res) => {
  const user = req.session.user;
  console.log(user);

  res.render("profile", user);
});

router.post("/logout", (req, res, next) => {
  if (!req.session) res.redirect("/");

  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});

module.exports = router;
