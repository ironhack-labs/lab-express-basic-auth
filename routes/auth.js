const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const app = require("../app");

router.get("/login", (req, res) => {
  console.log("Log in page");
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("You need to provide both; your email and your password");
  }

  User.findOne({ username }).then((userFromDB) => {
    if (!userFromDB) {
      console.log("please provide a correct username");
      return; //   error handle and say wrong username
    }
    bcrypt.compare(password, userFromDB.password).then((isSamePassword) => {
      if (!isSamePassword) {
        console.log("Wrong password");
        return;
      }
      // req.session.user || in this case, everytime we assign something to req.session we are storing it in the memory
      // DOWN is how we LOG IN
      req.session.user = userFromDB;
      console.log("This user is logged in", userFromDB);
      res.render("auth/profile", { userFromDB });
    });
  });
});

// geting sign up page - you get there by a link in view or typing manually
router.get("/signup", (req, res) => {
  console.log("Sing up page");
  res.render("auth/signup");
});
// sending the username and password
router.post("/signup", (req, res) => {
  console.log(`User input:`, req.body);
  const { username, password } = req.body;

  // checking if the user created an input for username and password
  if (!username || !password) {
    res.render("auth/signup", { errorMessage: "Please fill out all fields" });
    return;
  }

  // checking if the user already exists by using findOne in database //
  User.findOne({ username }).then((userBack) => {
    if (userBack) {
      res.render("auth/signup", { errorMessage: "Username already taken" });
      return;
    }

    // first - instructions to encrypt pass, than bcrypt password encrypt
    const hashAlgo = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, hashAlgo);

    User.create({
      username,
      password: hashedPass,
    }).then((newUser) => {
      console.log(`newUser: ${newUser}`);
      res.redirect("/");
    });
  });
});

module.exports = router;
