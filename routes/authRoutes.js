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

  //finally creates new user and add to Model/databse
  //use Model.create()

  //create new user object with entered username and encrypted password
  const newUserObject = {
    username: username,
    password: hashPass
  };

  // if neither password nor username is entered, then render error
  if (
    !username ||
    !password ||
    username === null ||
    password === null ||
    username === "" ||
    password === ""
  ) {
    res.render("signup", {
      errorMessage: "Enter username and a password for signup"
    });
  }

  // search if username already exists, elses render error

  UserModel.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      // if username does not exist, create new Model
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

//GET route to ACCESS login form
authRoutes.get("/auth/login", (req, res, next) => {
  res.render("login");
});

//POST route to SUBMIT login form
authRoutes.post("/auth/login", (req, res, next) => {
  //capture username and password

  const username = req.body.username;
  const password = req.body.password;

  // assess whether password/ username is blank = error

  if (
    !username ||
    !password ||
    username === null ||
    password === null ||
    username === "" ||
    password === ""
  ) {
    res.render("login", {
      errorMessage: "Username and password required to login"
    });
    return;
  }

  // search if username exists, elses render error

  UserModel.findOne({ username: username })
    .then(user => {
      if (!user) {
        //if no user found...
        res.render("login", {
          errorMessage: "Sorry, the username doesn't exist"
        });
        return;
      }
      //pass password to bcrypt and determine match with hash in database
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

authRoutes.get("/auth/logout", (req, res, next) => {
  req.session.destroy(err => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = authRoutes;
