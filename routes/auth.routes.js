const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");

const isLoggedIn = require("./../middleware/isLoggedIn");

const saltRounds = 10;

router.get("/signup", (req, res) => {
  res.render("auth/signup-form");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const usernameNotProvided = !username || username === "";
  const passwordNotProvided = !password || password === "";

  if (usernameNotProvided || passwordNotProvided) {
    res.render("auth/signup-form", {
      errorMessage: "You need to give a username and password",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    res.status(400).render("auth/signup-form", {
      errorMessage:
        "Your password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }
  User.findOne({ username: username })
    .then((foundUser) => {
      if (foundUser) {
        throw new Error("This username is already taken");
      }
      return bcrypt.genSalt(saltRounds);
    })
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({ username: username, password: hashedPassword });
    })
    .then((createdUser) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.render("auth/signup-form", {
        errorMessage: err.message || "Error while trying to sign up",
      });
    });
});

router.get("/login", (req, res) => {
  res.render("auth/login-form");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const usernameNotProvided = !username || username === "";
  const passwordNotProvided = !password || password === "";

  if (usernameNotProvided || passwordNotProvided) {
    res.render("auth/login-form", {
      errorMessage: "Provide an username and password",
    });
    return;
  }
  let user;

  User.findOne({ username: username })
    .then((foundUser) => {
      user = foundUser;
      if (!foundUser) {
        throw new Error("Wrong credentials");
      }
      return bcrypt.compare(password, foundUser.password);
    })
    .then((isCorrectPassword) => {
      if (!isCorrectPassword) {
        throw new Error("Wrong credentials");
      } else if (isCorrectPassword) {
        req.session.user = user;
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.render("auth/login-form", {
        errorMessage: err.massage || "Provide an username and password.",
      });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render("error");
    }

    res.redirect("/");
  });
});

module.exports = router;
