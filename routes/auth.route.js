const router = require("express").Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", (req, res, next) => res.render("auth/signup"));

router.post("/signup", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup", {
        errorMessage: "Please input all the fields",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, password: hashedPassword });
    res.redirect("/");
  } catch (error) {
    //Catch mongoose errors
    if (error instanceof mongoose.Error.ValidationError) {
      res.render('auth/signup', {
        errorMessage: error.message,
      });
    } else if (error.code === 11000) {
      res.render('auth/signup', {
        errorMessage: 'Email already registered',
      });
    }
    console.log(error);
    next(error);
  }
});

router.get("/login", isLoggedOut, (req, res, next) => res.render("auth/login"));

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;
    if (!password || !username) {
        res.render('auth/login', { errorMessage: 'Please input all the fields' });
      }
    let user = await User.findOne({ username });
    if (!user) {
      res.render("auth/login", { errorMessage: "This user doesn't exist" });
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      /* res.send(req.session.user) */
      res.redirect("/profile");
    } else {
      res.render('auth/login', { errorMessage: 'Wrong credentials' });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  /* res.send(user); */
  res.render("profile", user);
});
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});

router.get("/main", (req, res, next) => res.render("auth/main"));
router.get("/private", (req, res, next) => res.render("auth/private"));
module.exports = router;
