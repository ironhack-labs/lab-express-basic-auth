const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('login');
});


router.post('/', (req, res, next) => {
  let user = req.body.username;
  console.log(user);
  let password = req.body.password;

  User.findOne({user}, (err, userObject) => {
    if (err || !userObject){
      console.log("1");
      res.render("login");
      return;
    }
    if (bcrypt.compareSync(password, userObject.password)){
      console.log("2");
      req.session.currentUser = userObject;
      res.render("user", {user});
    } else {
      console.log("3");
      res.render ("login")
    }
  })
    
});



module.exports = router;
