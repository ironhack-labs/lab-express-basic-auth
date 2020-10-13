/*
 * Set-up.
 */
const express = require("express");
const router = express.Router();

// Bcryptjs library.
const bcrypt = require("bcryptjs");

// User model.
const UserModel = require("../models/User.model");

/*
 * Routes
 */
// Sign up.
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Validation conditions.
  if (!username || !password) {
    res.status(500).render("auth/signup", { error: "Fill all details." });
    return;
  }

  const usernameReg = new RegExp(
    /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  );

  if (!usernameReg.test(username)) {
    res.status(500).render("auth/signup.hbs", {
      error:
        "Usernames must be at least 4 characters up to 20, and can only have `_`, `.`, and letters.",
    });
    return;
  }

  const passwordReg = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/
  );

  if (!passwordReg.test(password)) {
    res.status(500).render("auth/signup.hbs", {
      error:
        "Password must have one lowercase, one uppercase, a number, a special character and must be atleast 8 digits long.",
    });
    return;
  }

  bcrypt.genSalt(10).then((salt) => {
    bcrypt
      .hash(password, salt)
      .then((hashedPass) => {
        UserModel.create({ username, password: hashedPass });
      })
      .then(() => {
        res.redirect("/");
      });
  });
});

// Log in.
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username: username }).then((data) => {
    bcrypt
      .compare(password, data.password)
      .then((result) => {
        if (result) {
          // I'm not sure what this is doing.
          req.session.loggedUser = data;
          res.redirect("/main");
        } else {
          res
            .status(500)
            .render("auth/login", { error: "Passwords do not match." });
        }
      })
      .catch(() => {
        res
          .status(500)
          .render("auth/login", { error: "Something went wrong. Try again." });
      });
  });
});

// Main.
router.get("/main", (req, res) => {
  if (req.session.loggedUser) {
    res.render("main", { name: req.session.loggedUser.username });
  } else {
    res.redirect("/login");
  }
});

// Private.
router.get("/private", (req, res) => {
  if (req.session.loggedUser) {
    res.render("private", { name: req.session.loggedUser.username });
  } else {
    res.redirect("/login");
  }
});

//Log out.
router.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/login");
});

module.exports = router;
