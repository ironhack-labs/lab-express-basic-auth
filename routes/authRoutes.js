const express = require("express");
const authRoutes = express.Router();
const UserModel = require("../models/UserModel"); // UserModel

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10; //means number of times to shuffle the deck of cards

//#1 - Sign Up

/* GET to ARRIVE at the AUTH page */
authRoutes.get("/auth/signup", (req, res, next) => {
  res.render("signup");
});

//POST to SUBMIT once at the AUTH page
authRoutes.post("/auth/signup", (req, res, next) => {
  //captures username and password from body
  const username = req.body.username;
  const password = req.body.password;

  //applies encryption (using salt method) to password - standard, don't change

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //finally creates new user and add to Moddel/databse
  //use Model.create()

  const newUserObject = {
    username: username,
    password: hashPass
  };

  if (
    !username ||
    !password ||
    username === null ||
    password === null ||
    username === "" ||
    password === ""
  ) {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
  }

  UserModel.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      UserModel.create(newUserObject)
        .then(createdUser => {
          console.log("User was successfully created");
          res.render("signup");
        })
        .catch(err => {
          console.log(
            "User could not be created because username already exists"
          );
        });
    })
    .catch(err => {
      console.log("Fields are required.");
    });
});

//#2 - Login

//#2

module.exports = authRoutes;
