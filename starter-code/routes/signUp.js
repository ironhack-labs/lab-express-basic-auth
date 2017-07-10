var express = require('express');
var router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signUp');
});
router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signUp", {
       errorMessage: "You should type your username and password"
     });
     return;
    }

User.findOne({"username": username}, (error, user) => {
  if(user !== null) {
    res.render('signUp', {
      errorMessage: "You can't pass due to some issues with your account"
    });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    username,
    password: hashPass
  });

  newUser.save(error => {
    if (error) {
      res.render("signUp", {
        errorMessage: " Sorry, try again"
        });
      } else {
        res.redirect('/');
      }
    });
  });
});
module.exports = router;
