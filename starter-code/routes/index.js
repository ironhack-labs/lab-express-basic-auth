const express = require('express');
const router  = express.Router();
const Users = require("../models/User");
const bcrypt  = require('bcrypt')



// Signin route
router.get('/', (req, res, next) => {
  res.render('signup');
});


// Signin write
router.post("/", (req, res) => {
  const saltRounds = 10;
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);

  console.log(req.body)
  if (req.body.username.length === 0 || req.body.password.length === 0) {
    res.render('error',{ message: "Fields are required" });
  } else{
    Users.findOne({ username: req.body.username })
    .then(userFound => {
      if (userFound !== null) {
        res.render('error',{ authorised: false, message: "Ooops. Username already exists" });
      }
      else {    
          Users.create({ username: req.body.username, password: hash })
          .then(userCreated => {
            res.render('success', { created: true, userCreated, message: "User successfully created!" });
          })
          .catch(() => {
            res.render('error', { created: false, message: "Username or password incorrect" });
          });
      }
    });
  }


});



module.exports = router;
