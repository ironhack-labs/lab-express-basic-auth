const bcrypt = require('bcryptjs');
const saltRounds = 10;

const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

router.get("/signup", (req, res, next) => {
    res.render('auth/signup')
});

/*
router.post("/signup", (req, res, next) => {
    console.log('req.body', req.body)
    const { username, password } = req.body;

    bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect(`/auth/profile/${userFromDB.username}`)
    })
    .catch(error => next(error));

});
*/
//Now with async await

router.post("/signup", async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userFromDB = await User.create({
      username,
      password: hashedPassword
    });

    console.log('Newly created user is: ', userFromDB);
    res.redirect(`/auth/profile/${userFromDB.username}`);
  } catch (error) {
    next(error);
  }
});

/*
router.get("/profile/:username", (req, res, next) => {
    User.findOne({ username: req.params.username })
        .then(foundUser => {
            console.log('foundUser', foundUser)
            res.render('auth/profile', foundUser)
        })
        .catch(err => console.log(err))
    
});
*/
//Now with async await function

router.get("/profile/:username", async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ username: req.params.username });
    console.log('foundUser', foundUser);
    res.render('auth/profile', foundUser);
  } catch (error) {
    console.log(error);
  }
});

// GET login page
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// POST login data
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Add your login authentication logic here, e.g., checking username and password against the user database

    // If authentication is successful, store user data in the session
    req.session.user = { username }; // You can store additional user information if needed

    res.redirect("/dashboard"); // Redirect to the dashboard or any other authorized page
  } catch (error) {
    console.log(error);
    res.render("auth/login", { error: "Login failed. Please try again." });
  }
});

module.exports = router;