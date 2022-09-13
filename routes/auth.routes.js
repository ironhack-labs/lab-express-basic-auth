const express = require("express");
const router = express.Router();

//password encryption
const bcrypt = require("bcryptjs");

//models
const User = require("../models/User.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// GET register page
router.get("/register", isLoggedOut, (req, res) => {
  res.render("register");
});
//POST register page
router.post("/register", isLoggedOut, (req, res) => {
  const { name, username, password, password2 } = req.body;
  let errors = [];

  //error checks
  if (!name || !username || !password || !password2) {
    errors.push({ msg: "All fields are required" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password and Password confirmation do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password needs to be at least 6 characters long" });
  }

  //handle errors
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      username,
      password,
      password2,
    });
  } else {
    User.findOne({ username: username }).then((user) => {
      //check if user already exists with the provided email
      if (user) {
        errors.push({
          msg: "Account already exists with provided username",
        });
        res.render("register", {
          errors,
          name,
          username,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          username,
          password,
        });

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash("successMessage", "Registration Successful");
                res.redirect("/login");
              })
              .catch((err) => {
                console.log(err);
              });
          })
        );
      }
    });
  }
});

//GET login page
router.get("/login", isLoggedOut, (req, res) => {
  res.render("login");
});
//POST login page
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: "All fields are required" });
  }

  if (errors.length > 0) {
    res.render("login", {
      errors,
      username,
      password,
    });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          req.flash(
            "errorMessage",
            "Could not find an account with that username"
          );
          res.redirect("login");
          return;
        } else if (bcrypt.compareSync(password, user.password)) {
          // res.render('users/user-profile', { user });
          //   res.render("users/user-profile", { user });
          req.session.currentUser = user;
          res.redirect("/userProfile");
        } else {
          req.flash("errorMessage", "Incorrect password");
          res.redirect("login");
        }
      })
      .catch((error) => next(error));
  }
  console.log("SESSION =====> ", req.session);
});

//userprofile page
router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("users/main", { userInSession: req.session.currentUser });
});

//logout
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

//private
router.get("/private", isLoggedIn, (req, res) => {
  res.render("users/private");
});

module.exports = router;
