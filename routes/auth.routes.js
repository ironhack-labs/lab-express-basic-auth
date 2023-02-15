const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route.guard");

/* const regex = /"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; */

router.get("/signup", (req, res) => res.render("authentication/signup"));

router.post("/signup", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render("authentication/signup", {
        errorMessage: "Please input all the fields",
      });
    }

    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!regex.test(password)) {
      res.render("authentication/signup", {
        errorMessage:
          "Your password needs to be 8 characters long and include lowercase letters and uppercase letters.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });

    res.redirect("/");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.render("authentication/signup", { errorMessage: errorMessage });
    } else if (error.code === 11000) {
      res.render("authentication/signup", {
        errorMessage: "E-mail already registered",
      });
    }
    console.log(error);
    next(error);
  }
});

router.get("/login", isLoggedOut, (req, res) =>
  res.render("authentication/login")
);

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render("authentication/login", {
        errorMessage: "Please input all the fields",
      });
    }

    let user = await User.findOne({ username });
    if (!username) {
      res.render("authentication/login", {
        errorMessage: "Username not found",
      });
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect("/private");
    } else {
      res.render("authentication/login", { errorMessage: "Wrong Credentials" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/private", isLoggedIn, (req, res) => {
  let user = req.session.user;

  res.render("authentication/private", user);
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});

module.exports = router;
