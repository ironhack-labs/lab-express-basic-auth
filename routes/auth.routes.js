const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const saltRounds = 10;

// Get login
router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

// Handles Login Post request
// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  // req.body destructuring
  // and email and password validation stay the same
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        //******* SAVE THE USER IN THE SESSION ********//
        const { email, _id } = user;
        req.session.currentUser = { email, _id };
        req.app.locals.currentUser = req.session.currentUser;

        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

/* GET signup page */
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

// handles Signup POST request
router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Provide both email and password",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        email,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      const { email, _id } = userFromDB;

      req.session.currentUser = { email, _id };
      req.app.locals.currentUser = req.session.currentUser;
      res.redirect("/userProfile");
    })
    .catch((error) => next(error));
});

// Get user profile
router.get("/userProfile", isLoggedIn, (req, res) =>
  res.render("users/user-profile")
);

// main route
router.get("/main", isLoggedIn, (req, res) => res.render("users/main"));

// private route
router.get("/private", isLoggedIn, (req, res) => res.render("users/private"));

// handles logout
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    req.app.locals.currentUser = null;
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
