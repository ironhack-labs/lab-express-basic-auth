const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");

saltRounds = 10;

const router = new Router();

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      console.log(hashedPassword);
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log(userFromDB.username);
      // console.log('Newly created user id: ', userFromDB);
      // req.session.currentUser = userFromDB;
      res.render("auth/profile", { userFromDB });
    })
    .catch((error) => console.log(error));
});

router.get("/profile", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((userFromDB) => {
      if (!userFromDB) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcrypt.compareSync(password, userFromDB.passwordHash)) {
        console.log("z");
        res.render("auth/profile", { userFromDB });
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res) => res.render("auth/login"));

module.exports = router;
