const express = require("express");
const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model");

const router = express.Router();

// 1. show form
router.get("/signup", (req, res, next) => {
  res.render("user-views/signup-page");
});

// 2. process form
router.post("/process-signup", (req, res, next) => {
  if (req.body.signupPassword === "" ||
      req.body.signupPassword.length < 1
      // req.body.signupPassword.match(/[^a-z0-9]/i) === null
    ){
      res.locals.errorMessage = "Password is invalid";
      res.render("user-views/signup-page");
      return;
    }
  UserModel.findOne({username: req.body.signupUsername})
    .then((userFromDb) => {
      if (userFromDb !== null){
        res.locals.errorMessage = "Username is taken";
        res.render("user-views/signup-page");
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);
      const theUser = new UserModel({
        username: req.body.signupUsername,
        encryptedPassword: scrambledPassword
      });
      return theUser.save();
    })
    // 3. redirect
    .then(() => {
      res.redirect('/');
    })
  .catch((err) => {
    next(err);
  });
});



module.exports = router;
