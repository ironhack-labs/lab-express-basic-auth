const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});


router.post('/login', (req, res, next) => {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;


  if( username === "" || password === "") {
    var errorMessage = "Enter both username and password porfaplis";
    res.render('auth/login', {errorMessage});
    return;
  };


User.findOne( { username: username }, (err, user) => {
  if (err) {
    return next(err);
  }
  else if(!user) {
    var errorMessage = "User doesn't exists. please signup";
    res.render('auth/login', {errorMessage});
    return;
  }

  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.redirect('/main');
    return;
  }
  else {
    var errorMessage = "Invalid password bro";
    res.render('auth/login', {errorMessage});
    return;
  }

});



});




module.exports = router;
