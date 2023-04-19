const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// SIGN UP -------------------------------------------

router.get("/auth/signup", (req, res) => {
  res.render("signup");
});

router.post("/auth/signup", (req, res, next) => {
  const { username, password } = req.body;

  // Validation
  // 1. Check username is empty and password at least 8 characters

  if (username === "") {
    res.render("signup", { message: "Username cannot be empty" });
    return;
  }

  if (password.length < 8) {
    res.render("signup", { message: "Pasword has to be minimum 8 characters" });
    return;
  }

  // If validation passed
  // 2. Check if the unsername is already taken

  User.findOne({ username }).then((userFromDB) => {
    if (userFromDB !== null) {
      res.render("signup", { message: "Username is already taken" });
    } else {
      // If username is available, then we can use the password and hash it
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      // and we  create the User
      User.create({ username, password: hash })
        .then((createdUser) => res.redirect("/auth/login"))
        .catch((err) => next(err));
    }
  });
});

// LOGIN -------------------------------------------

router.get("/auth/login", (req, res) => {
  res.render("login");
});

router.post("/auth/login", (req, res, next) => {
  // Takes input from body
  const { username, password } = req.body;

  // 1. Find user in database by username
  User.findOne({ username }).then((userFromDB) => {
    if (userFromDB === null) {
      // If user not found in database, then we show log in form again
      res.render("login", {
        message: "False user name or you are not registered yet",
      });
      return;
    }
    // If user is found in the database, we check that the password match
    if (bcrypt.compareSync(password, userFromDB.password)) {
      // If password is correct, then we get the user and password and start the session
      req.session.user = userFromDB;
      req.session.user.password = null;

      // And we redirect to profile page
      res.redirect("/profile");
    } else {
      res.render("login", { message: "Wrong password" });
      return;
    }
  });
});

// LOGOUT -------------------------------------------

router.get("/auth/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
