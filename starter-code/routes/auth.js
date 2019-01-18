const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Route get
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//Route Post
router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let pass = req.body.password;
  //Bcrypt encryption methods (Do not forget)
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(pass, salt);

  //First validation the user and pass cannot be empty
  if (username === "" || pass === "") {
    res.render("auth/signUp", {
      errorMessage: "The username or password cannot be empty"
    });
  }
  //Second validation the user must be unique for each sign up
  User.findOne({ username: username }).then(user => {
    //if the user is found on db
    if (user !== null) {
      res.render("auth/signUp", {
        errorMessage: "The user already exists"
      });
      return;
    }

    const newUser = User({
      username,
      password: hashPass
    });

    newUser
      .save()
      .then(user => {
        res.redirect("/");
      })
      .catch(err => console.log(err));
  });
});

module.exports = router;
