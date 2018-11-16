
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');


router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/signUp", (req, res, next) => {
  
  res.render("auth/signUp");
});

router.post('/signup', (req, res) => {

  const {username, password} = req.body;

  const saltRounds = 5;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password : hash
  })
  newUser.save()
  .then(user => {
    console.log(user);
    res.redirect('/auth/login')
  })
})

module.exports = router;