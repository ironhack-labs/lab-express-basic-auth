const express = require('express');
const router  = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


/* GET home page */

router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post("/signup", (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser  = User({
    name,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/");
  });
});

module.exports = router;
