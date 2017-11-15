const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user-model");

const router = express.Router();


router.get("/signup", (req, res, next) => {
  res.render("signup-page");
});

router.post("/process-signup", (req, res, next) => {

  if (req.body.signupPassword === "" ||
      req.body.signupPassword.length < 8 ||
      req.body.signupPassword.match(/[^a-z0-9]/i) === null) {
        res.locals.errorMessage = "Password is invalid";
        res.render("signup-page");

        return;
      }
      UserModel.findOne({userName: req.body.signupUserName})
      .then((userFromDb) => {
        if (userFromDb !== null) {
          res.locals.errorMessage = "Username is taken!";
          res.render("signup-page");

          return;
        }
      const salt = bcrypt.genSaltSync(10);

      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel({
        userName: req.body.signupUserName,
        encryptedPassword: scrambledPassword
      });
      return theUser.save();

      })

  .then(() => {
    res.redirect("/");
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
