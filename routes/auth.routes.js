const { Router } = require('express');
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

router.get("/signup", (req, res, next ) => {
    res.render("/signup")
});

router.post("/signup", (rq, res, next) => {
    const {username, password} = req.body;
    bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res) => res.render("users/user-profile"));

module.exports = router;