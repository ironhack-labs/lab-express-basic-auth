const express = require("express");
const bcrypt = require("bcrypt");

const UserModel = require("../models/user-models");

const router = express.Router();


router.get("/signup", (req, res, next) => {
  res.render("user-views/user-signup");
});



router.post("/user-signup", (req, res, next) => {
  if (
    req.body.signupPassword === "" ||
    req.body.signupUserName === ""
  ) {

    res.locals.errorssMessage = "You Need A User Name and Password";

    res.render("user-views/user-signup");

    return;
  } else if (


      req.body.signupPassword.length <= 6 ||

      req.body.signupPassword.match(/[^a-z0-9]/i) === null

    ) {

  res.locals.errorMessage = "You Need A Password That is More Than 6 Characters";
  res.render("user-views/user-signup");

  return;
} else if (

    req.body.signupUserName.length <= 4 




  ) {
res.locals.errorsMessage = "You Need A User Name With 4 or More Characters ";

res.render("user-views/user-signup");

return;
}



const salt = bcrypt.genSaltSync(10);

// encrypt the password submitted by the user from the form
//                                              |
const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

const theUser = new UserModel({
  userName: req.body.signupUserName,
  password: scrambledPassword
});

theUser.save()
.then(() => {
  res.redirect("/");
})
.catch((err) => {
  next(err);

});
});

module.exports = router;
