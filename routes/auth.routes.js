const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

router.get("/signup", (req, res) => {
    res.render("auth/signup");
  });

  router.post("/signup", (req, res) => {
    console.log('the form data', req.body);
    const { username, password } = req.body;
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => {
            return bcryptjs.hash(password, salt);
      })
      .then((hashedPassword) => {
        console.log("Hasted Password", hashedPassword);
       return User.create({
          username: username,
          passwordHash: hashedPassword,
        });
        })
        .then((userFromDB) => {
        console.log("Newly created user is: ", userFromDB);
          res.redirect("/profile");
      })
      .catch((error) => {
        console.log(error)
      });
  })

  router.get("/profile", (req, res) => {
    res.render("user/user-profile")});
  module.exports = router