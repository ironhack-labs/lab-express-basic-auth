const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user-model");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("");
});

router.post("/", (req, res, next) => {
  const un = req.body.userName;
  const pw = req.body.userPassword;
  if ( un === "" || pw === "")
    {
      // display form again if it is
      res.locals.errorMessage = "Please fill all fields";
      res.render("");
      // early return to prevent the rest of the code from running
      return;
    }
  UserModel.findOne({userName: un}).then(dbUser => {
    if(dbUser){
      res.locals.errorMessage = "Username is taken";
      res.render('');
      return;
    }
    const salt = bcrypt.genSaltSync(10);

// encrypt the password submitted from the form
//                                           |
const scrambledPassA = bcrypt.hashSync(pw, salt);

const theUser = new UserModel({
  userName: un,
  encryptedPassword: scrambledPassA
});
// return the promise of the next database query
return theUser.save();
  }).then(() => {
      // redirect to the home page on a successful sign up
      res.redirect("/");
    })
    .catch( err => {
      next(err);
    });
});


module.exports = router;
