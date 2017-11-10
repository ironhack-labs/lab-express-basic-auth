// const express = require("express");
// const router = express.Router();

// const User = require("../models/user");

// // BCrypt to encrypt passwords
// const bcrypt = require("bcrypt");
// const bcryptSalt = 10;

// router.get("/signup", function(req, res, next) {
//   res.render("auth/signup");
// });

// router.post("/signup", (req, res, next) => {
//   var username = req.body.username;
//   var password = req.body.password;
//   var salt = bcrypt.genSaltSync(bcryptSalt);
//   var hashPass = bcrypt.hashSync(password, salt);

//   var newUser = User({
//     username,
//     password: hashPass
//   });

//   if (username!==)

//   newUser.save(err => {
//     res.redirect("/");
//   });
// });

// module.exports = router;

var express = require("express");
var router = express.Router();
// User model
const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);
  var newUser = User({
    username,
    password: hashPass
  });
  newUser.save(err => {
    res.redirect("/");
  });
});

router.get("/login", function(req, res, next) {
  res.render("auth/login");
});

router.post("/login", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    // IF USERNAME === USERNAME.DATABASE basic-auth.users
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

router.get("/signup", function(req, res, next) {
  res.render("auth/signup");
});
router.post("/signup", function(req, res, next) {
  // CHECK IF USERNAME ALREADY EXISTS
  User.findOne({ username: username }, "username", (err, username) => {
    if (username !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save(err => {
      res.redirect("/");
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("/");
      }
    });
  });
  //////
});
module.exports = router;
