const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

const { Router } = require("express");
const router = new Router();

const saltRounds = 10;

const User = require("../models/User.model");

// ITERATION 1 - Route to Singup page
// Router GET
router.get("/signup", (req, res) => res.render("auth/sign-up"));

// Router POST -> gets info from the form
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
   
    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        // Saving user to database
      return User.create({
        username,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
    })
    .catch(error => next(error));
});

module.exports = router;