const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

// Iteration#1 Sign Up
router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword
      });
    })
    .then((userFromDB) => {
        console.log(userFromDB),
        res.redirect('/userProfile')})
    .catch((error) => next(error));
});

router.get('/userProfile', (req, res) => res.render('users/user-profile'));


module.exports = router;
