const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 5;

const User = require("../models/user");

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});


router.post('/signup', (req, res, next) => {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if( username === "" || password === "") {
    var errorMessage = "Enter both username and password porfaplis";
    res.render('auth/signup', {errorMessage});
    return;
  };

  const newUser = new User ({
    username: username,
    password: hashPass
  })

User.findOne( { username: username }, (err, user) => {
  if (user !== null) {
    var errorMessage = "User already exists. Pick another username";
    res.render('auth/signup', {errorMessage});
    return;
  }
})

  newUser.save((err) => {
    if (err) {
      return next(err);
    }
    else {
      res.redirect('/');
    }
  });

});

module.exports = router;
