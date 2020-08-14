const { Router } = require("express");
const router = new Router();
const bycrypt = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.render("user-signUp");
});

router.post("/", (req, res, next) => {
  // console.log(req.body);
  const { usrName, usrPassword } = req.body;
  if (!usrName || !usrPassword) {
    res.render("user-signUp", {
      errorMessage:
        "Both fields are mandatory. Please provide your username and password.",
    });
    return;
  }
  // store the user detailsinto DB
  bycrypt
    .genSalt(saltRounds)
    .then((salt) => bycrypt.hash(usrPassword, salt))
    .then((hashedPassword) => {
      // console.log(" Password hashed:", hashedPassword);
      return User.create({
        username: usrName,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      // console.log("Newly created user is: ", userFromDB);
      // req.session.userInformation = userFromDB;
      // res.redirect("userProfile");
      req.session.isSignup = true;
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);

      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("user-signUp", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("user-signUp", {
          errorMessage: "Username need to be unique. Username is already used.",
        });
      } else {
        next(error);
      }
    });
});

module.exports = router;
