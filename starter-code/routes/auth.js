const express = require("express");
const router = express.Router();
//call model
const User = require("../models/User");
//BCrypt for password
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) =>{
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // const salt = bcrypt.genSaltSync(bcryptSalt);
  // const hashPass = bcrypt.hashSync(password, salt);

  // User.create({
  //   username,
  //   password: hashPass
  // })
  // .then(() => {
  //   res.redirect("/auth/signup");
  // })
  // .catch(error => {
  //   console.log(error);
  // });
  User.findOne({"username": username})
  .then(user => {
    if(user !== null){
      res.render("auth/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      username,
      password: hashPass
    })
    .then(() => {
      res.redirect("/auth/signup");
    })
    .catch(error => {
      console.log(error);
    })
  })
  .catch(error => {
    next(error);
  });

  if (username === ""||password === ""){
    res.render("auth/signup",{
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

});

module.exports = router;