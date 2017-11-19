const express = require("express");
const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model");

const router = express.Router();



router.get("/signup", (req, res, next) => {
  res.render("user-views/signup-page");
});



router.post("/process-signup", (req, res, next) => {

  const salt = bcrypt.genSaltSync(10);

  UserModel.findOne({ userName: req.body.signupUserName})
   .then((userFromDb) => {
     // userFromDb will be null if the Username IS NOT taken

     // display the form again if the Username is taken
     if(userFromDb !== null) {
       res.locals.errorMessage = "Username is taken";
       res.render("user-views/signup-page");
     }

    if(req.body.signupUserName === null){
      res.locals.errorMessage = "We need a name";
      res.render("user-views/signup-page");

      return;
    }

    if (req.body.signupPassword.length < 16 ||
        req.body.signupPassword.match(/[^a-z0-9]/i) === null
    ) { //if no special characters  (Regular expression)
      res.locals.errorMessage = "Password is invalid";
      res.render("user-views/signup-page");

      //early return: stops function from continuing since there's an error
      return;
    }

    //encrypt the password password submitted by the user from the form
    //
    const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

    const theUser = new UserModel({

      userName: req.body.signupUserName,
      encryptedPassword: scrambledPassword

    });

    return theUser.save();
  })

  .then(() => {
    //redirect users to home page if sign up was successful
    res.redirect('/');
  })
  .catch((err) => {
    next(err);
  });  

});


module.exports = router;
