const express = require('express');
const router  = express.Router();
const User = require('../models/user')

const bcrypt = require('bcrypt');
const bcryptSalt = 10;



/* singup*/

router.get('/singup', (req, res, next) => {
  res.render('singup');
});

router.post('/singup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    username,
    encriptedPassword: hashPass
  });

  newUser.save()
  .then(user => {
    console.log( 'New user created');
    res.redirect('/');
  })
  //res.render('singup');
});


module.exports = router;