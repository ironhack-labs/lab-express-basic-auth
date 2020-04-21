const express = require("express");
const router = express.Router();

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");

// User model
const User = require("../models/user-model");

// Iteration 1:

router.get("/signup", (request, response) => {
  response.render("signup");
});

router.post("/signup", (request, response, next) => {
  const { username, password } = request.body;
  // if (password.length < 8) {
  //   response.render("signup", {
  //     message: "Your password must be 8 characters minimum",
  //   });
  //   return;
  // }
  if (username === "") {
    response.render("signup", { message: "Your username cannot be empty" });
    return;
  }
  // check if username already exists
  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      response.render("signup", { message: "Username is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then((dbUser) => {
          // login the user
          response.redirect("/login");
        })
        .catch((error) => {
          next(error);
        });
    }
  });
});

// Iteration 2:

router.get("/login", (request, response) => {
  response.render("login");
});

router.post("/login", (request, response, next) => {
  const { username, password } = request.body;
  console.log({ username, password });
  User.findOne({ username: username })
    .then((user) => {
      console.log(user);
      if (user === null) {
        // no user has this username
        response.render("login", { message: "Invalid credentials" });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // password and hash match
        request.session.user = user;
        response.redirect("/profile");
      } else {
        response.render("login", { message: "Invalid credentials" });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      response.redirect("/");
    }
  });
});

module.exports = router;
