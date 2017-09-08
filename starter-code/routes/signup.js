const express = require('express');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const SignUp = require('../models/signup')

// require the Drone model here

const router = express.Router();


router.get('/', (req, res, next) => {
  SignUp.find({}, (err, signup) => {
    if (err) {
      next(err);
    } else {
      res.render('signup')
    }
  })
});

// router.post("/", (req, res, next) => {
//   let newUserInfo = {
//     username: req.body.username,
//     password: req.body.password,
//     hashPass: bcrypt.hashSync(password),
//   }
//   const newUser  = new SignUp(newUserInfo);
//     newUser = SignUp ({
//       username,
//       password: hashPass
//     }),
//
//     newUser.save((err)=> {
//       if (err) {next(err);}
//       else{
//         res.redirect('/');
//       }
//     })
//   });


  router.post("/", (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (username === "" || password === "") {
      res.render("signup", {
        errorMessage: "Please enter a username and a password to sign up"
      });
      return;
    }

  SignUp.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists"
      });
      return
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = SignUp({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      res.render("welcome")
      res.redirect("/welcome");
    });
  });

  const newUser  = SignUp({
    username,
    password: hashPass
  });

  });


module.exports = router;
