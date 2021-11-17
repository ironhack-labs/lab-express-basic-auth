const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const isLoggedin = require("./../middleware/isLoggedin");

const saltRounds = 10;

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  //Check if user exists
  const usernameNotProvided = !username || username === "";
  const passwordNotProvided = !password || password === "";

  if (usernameNotProvided || passwordNotProvided) {
    console.log("This is not provided ");
    res.render("signup", {
      errorMessage: "Provide username and password.",
    });
    return;
  }

  User.findOne({ username: username })
    .then((foundUser) => {
      if (foundUser) {
        throw new Error("The username is taken");
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
      res.render("signup", {
        errorMessage: err.message || "Error while trying to sign up",
      });
    });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const usernameNotProvided = !username || username === "";
  const passwordNotProvided = !password || password === "";

  if (usernameNotProvided || passwordNotProvided) {
    res.render("login", {
      errorMessage: "Provide username and password.",
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
        throw new error("Wrong credentials");
      }
      req.session.user = user;
      res.redirect("/");
    })
    .catch((err) => {
      res.render("login", {
        errorMessage: err.message || "Provide username and password.",
      });
    });
});

router.get("/logout", isLoggedin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("error");
    }
    res.redirect("/");
  });
});

module.exports = router;
