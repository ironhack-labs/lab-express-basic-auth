const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcryptjs = require("bcryptjs");
const bcryptjsSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(
    `este es el usuario ${username}  y esta la contraseña ${password}`
  );

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ name: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    const salt = bcryptjs.genSaltSync(bcryptjsSalt);
    const hashPass = bcryptjs.hashSync(password, salt);

    const newUser = User({
      name: username,
      password: hashPass
    });

    newUser.save(err => {
      res.redirect("/");
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(
    `este es el usuario ${username}  y esta la contraseña ${password} que se esta logando`
  );

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ name: username }, (err, user) => {
    if (err || !user) {
      console.log(
        `este es el usuario ${username}  y esta la contraseña ${password} que llega y es el user ${user} `
      );
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcryptjs.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      console.log(
        `este es el usuario ${username} se ha logado correctamente`
      );
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

module.exports = router;
