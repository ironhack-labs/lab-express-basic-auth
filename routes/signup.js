const router = require("express").Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");

//SIGN UP

router.get("/sign-up", (req, res, next) => {
  res.render("signup.hbs");
});

router.post("/sign-up", (req, res, next) => {
  const { username, password } = req.body;
  bcrypt
    .genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedpassword) => {
      return User.create({ username, password: hashedpassword });
    })
    .then((newUser) => {
      console.log(newUser, " has been created");
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

module.exports = router;

// TO CHECK IF THE USER ALREADY EXIST
/*
router.post("/sign-up", (req, res, next) => {
  const { username, password } = req.body;
  User.find({ username: username })
    .then((foundUser) => {
      console.log(foundUser);
      if (foundUser.length !== 0) {
        console.log("existing user " + foundUser);
        res.redirect("/");
      } else {
        bcrypt
          .genSalt(10)
          .then((salt) => {
            return bcrypt.hash(password, salt);
          })
          .then((hashedpassword) => {
            return User.create({ username, password: hashedpassword });
          })
          .then(() => {
            res.redirect("/");
          })
          .catch((error) => {
            console.log(error);
            next(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });


*/
