const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt");
const saltRounds = 10;



/* GET home page */

router.get('/', (req, res, next) => {
  res.render('signup');
});


router.post('/', (req, res, next) => {
  let user = req.body.username;
  let password = req.body.password;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = User(
    {
      user,
      password: hash
    }
  );
  newUser.save((err) => {
    console.log(newUser);
    res.redirect("/");
  })
});



module.exports = router;
