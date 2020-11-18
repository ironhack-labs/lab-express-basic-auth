const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

//login
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  //check if username exists in db, and if not re-render login
  User.findOne({ username: username })
    .then((usernameFromDB) => {
      if (usernameFromDB === null) {
        console.log("username from db", usernameFromDB);
        res.render("auth/login", { message: "Invalid credentials" });
      }
      if (bcrypt.compareSync(password, usernameFromDB.password)) {
        //if password and hash match, login the user
        req.session.user = usernameFromDB;
        res.redirect("/");
      } else {
        res.render("auth/login", { message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      console.log("error in login", err);
    });
});

//signup
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render("auth/signup", { message: "Password must be 8 chars min" });
  }
  if (username === "") {
    res.render("auth/signup", { message: "Username cannot be empty" });
  }

  //checking if username already exists:
  User.findOne({ username: username }).then((usernameFound) => {
    if (usernameFound !== null) {
      res.render("auth/signup", { message: "Wrong credentials" });
    } else {
      //create user and hash the password:
      const salt = bcrypt.genSaltSync();
      console.log(salt);
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then((userFromDB) => {
          req.session.user = userFromDB;
          res.redirect("/");
        })
        .catch((err) => {
          console.log("error in signup", err);
        });
    }
  });
});

const checkIfLoggedin = () => {
  return (req, res, next) => {
    //check if user is logged in:
    if (req.session.user) {
      next();
    } else {
      //otherwise back to login
      res.redirect("/auth/login");
    }
  };
};

router.get("/main", checkIfLoggedin(), (req, res, next) => {
  res.render("auth/main");
});

router.get("/secret", checkIfLoggedin(), (req, res, next) => {
  res.render("auth/secret");
});

module.exports = router;
