const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      res.render("auth/signup", {
        errorMessage: "Please input all the fields",
      });
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

      if (!regex.test(password)) {
        res.render("auth/signup", {
          errorMessage:
            "Your password needs to be 8 characters long and include lowercase letters and uppercase letters",
        });
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.create({ email, password: hashedPassword });
    }
    res.redirect("/");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/signin", (req, res, next) => {
  res.render("auth/signin");
});

router.post("/signin", async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!password || !email) {
      res.render("auth/login", {
        errorMessage: "Please input all the fields",
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      res.render("auth/signin", { errorMessage: "Account does not exist" });
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;

      res.redirect("/");
    } else {
      res.render("auth/signin");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/signout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});

router.get("/profile", isLoggedIn, async (req, res, next) =>{
  let user = req.session.user
    res.render("profile", user)
})

router.get("/main", isLoggedIn, async(req, res, next)=> {
    res.render("main")
})

router.get("/private", isLoggedIn, async (req, res, next) => {
  res.render("private");
});

module.exports = router;
