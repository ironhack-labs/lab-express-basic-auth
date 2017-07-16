var express = require('express');
var router = express.Router();

// User model
const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET users listing. */
router.get('/signup', function (req, res, next) {
    console.log("request:",req.session); //el parametro session es añadido por el paquete session 
    res.render('signup');
});


router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        // User has been created...now what?
        res.render('index');
      }
    });
  });
});


module.exports = router;