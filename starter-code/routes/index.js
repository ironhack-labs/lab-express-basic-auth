// This is our auth.js
const express = require('express');
const router  = express.Router();
// User model
const User = require("../models/user");
// var zxcvbn = require('zxcvbn');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.post("/signup", (req, res, next) => 
{
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") 
  {
    res.render("auth/signup", 
    {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => 
  {
  if (user !== null) 
    {
      res.render("auth/signup", 
      {
        errorMessage: "The username already exists!"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create(
    {
      username,
      password: hashPass
    })
    .then(() => 
    {
      res.redirect("/");
    })
    .catch(error => 
    {
      console.log(error);
    })
  })

  .catch(error => 
  {
    next(error);
  })

});

module.exports = router;


// For User to create stronger password:

// requirejs(["relpath/to/zxcvbn"], function (zxcvbn) {
//   console.log(zxcvbn('Tr0ub4dour&3'));
// });