// routes/auth.routes.js
 
const { Router } = require('express');
const router = new Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// GET route ==> userProfile

router.get("/userProfile", (req, res) => res.render("users/user-profile"));
 
// GET route ==> to display the signup form to users

router.get("/signup", (req, res) => res.render("auth/signup"));
 
// POST route ==> to process form data

router.post("/signup", (req, res, next) => {
  // console.log("The form data: ", req.body);

  const { username, password } = req.body;

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
      console.log("Newly created user is: ", userFromDB);
    })

    .catch((error) => next(error));
});

//////////// L O G I N ///////////
 
// GET route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { name, password } = req.body;

  if (name === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, name and password to login.",
    });
    return;
  }

  User.findOne({ name })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "name is not registered. Try with other name.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});


router.get('/main', (req, res) => res.render('/auth/main'));

router.get("/private", (req, res) => res.render("/auth/private"));


 
module.exports = router;