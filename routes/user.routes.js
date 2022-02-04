//Express
const res = require("express/lib/response");
const router = require("express").Router();
//User model
const User = require("../models/User.model");
//Bcryptjs
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

//Routes
//Loading Sign Up page
router.get("/signup", (req, res) => {
  res.render("signup/signup");
});

//Sign Up form
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salted) => bcryptjs.hash(password, salted))
    .then((hashPassword) => {
      return User.create({ username, password: hashPassword });
    })
    .then((createdUser) => {
      // console.log(`New user -> ${createdUser}`);
      res.redirect("users/user-page");
    })
    .catch((error) => {
      console.log(`there was an error signing up ${error}`);
      //   res.redirect("sign-up/sign-up");
    });
});

//Loading User page
router.get("/users/user-page", (req, res) => res.render("users/user-page"));

module.exports = router;
