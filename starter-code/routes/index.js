/*jshint esversion:6*/
//controller
var express = require('express');
var router = express.Router();

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  console.log('username', username);
  const hashPass = bcrypt.hashSync(password, salt);

  if(username === '' || password === ''){
    res.render('index',{
      errorMessage: 'Indicate user name and password'
    });
    return;
  }
    User.findOne({username},"username", (err,user)=>{
    if(user !== null){
      res.render('index',{
        errorMessage: 'The user name already exists'});
        return;
    }
  });
  var newUser = User({
    username,
    hash:hashPass
  });

  newUser.save((err) => {
    res.redirect("/");
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
     header: 'Express'
   });
 });

module.exports = router;
