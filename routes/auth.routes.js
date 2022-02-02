const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = new Router();
const mongoose = require("mongoose");

const saltRounds = 10;

//GET to render user profile page
router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

//GET route to display signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

//POST route to process signup form data
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  // make sure users fill all mandatory fields:
  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }
  //salt password
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username needs to be unique. Username already taken.",
        });
      } else {
        next(error);
      }
    });
});

//GET route ==> display the login form to users
router.get("/login", (req, res) => res.render("auth/login"));

//POST route to process login form data
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "User is not registered. Try a different username or signup.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //res.render('users/user-profile', { user });
        //SAVE the user in the session
        //the next 2 lines are related to the get /userProfile below
        req.session.currentUser = user;
        console.log('this is the session', req.session);
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});
 

//GET to render user profile page
router.get("/userProfile", (req,res) => res.render("users/user-profile"));

module.exports = router;