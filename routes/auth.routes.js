const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const saltRounds = 10;

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const message =
      "Both the username and password fields have to be filled in.";

    res.render("user/signup", { errorMessage: message });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!regex.test(password)) {
    res.status(500).render("user/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({ username, password: hashedPassword });
    })
    .then((user) => {
      console.log("A new user was signed up: ", user);

      req.session.currentUser = user;

      res.redirect("/profile");
    })
    .catch((error) => {
      console.log("An error occured while signing up a user: ", error);

      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("user/signup", {
          errorMessage: error.errors.username || error.errors.password,
        });
      } else if (error.code === 11000) {
        res.status(500).render("user/signup", {
          errorMessage: "The entered username already exists.",
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("user/login", {
      errorMessage:
        "Both the username and password fields have to be filled in.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      console.log("User attempting to log in: ", user);
      if (!user) {
        console.log("No user found that matched the entered username");
        res.status(500).render("user/login", {
          errorMessage: "Incorrect username or password.",
        });
      } else if (bcrypt.compareSync(password, user.password)) {
        console.log("User successfully logged in!");

        req.session.currentUser = user;
        res.redirect("/profile");
      } else {
        console.log("Wrong password entered");
        res.render("user/login", {
          errorMessage: "Incorrect username or password.",
        });
      }
    })
    .catch((error) => {
      console.log("An error occured while loggin in a user: ", error);
      next(error);
    });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.get("/profile", (req, res) => {
  const userInSession = req.session.currentUser;

  res.render("user/profile", { userInSession });
});

module.exports = router;
