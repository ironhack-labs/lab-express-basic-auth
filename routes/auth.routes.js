const router = require("express").Router();
const bcrypt = require("bcryptjs");
// const { application } = require("express");
const saltRounds = 10;
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route.guard");

router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      console.log("info missing");
      res.render("auth/signup.hbs", {
        errorMessage:
          "Please fill in all mandatory fields. Email and password are required.",
      });
      return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.render("auth/signup", {
        errorMessage:
          "Password not long enough. Must contain at least one uppercase letter",
        username: username,
        password: password,
      });
      return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      username: username,
      passwordHash: hashedPassword,
    });
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
});

router.get("/login", isLoggedOut, (req, res, next) => {
  try {
    res.render("auth/login");
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    console.log(`SESSION -----> ${req.session}`);
    const { username, password } = req.body;
    if (!username || !password) {
      res.render("auth/login", {
        errorMessage: "please enter a valid email and password",
      });
    }
    const user = await User.findOne({ username });
    await console.log(user);
    if (!user) {
      await res.render("auth/login", { errorMessage: "User not found" });
    }
    if (bcrypt.compareSync(password, user.passwordHash)) {
      req.session.currentUser = user;
      await res.redirect("/profile");
    }
    if (!bcrypt.compareSync(password, user.hashedPassword)) {
      await res.render("auth/login", { errorMessage: "Incorrect Password" });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  try {
    res.render("profile/user-profile", {
      userInSession: req.session.currentUser,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
