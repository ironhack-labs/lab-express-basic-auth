
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;

router.get('/', (req, res, next) => {
  res.render('signup');
})

router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


  if (req.body.username === '' || req.body.password === '' ) {
    res.render('signup', { errorMessage: "Field is blank"});
    return;
  }
  User.findOne({ 'username': req.body.username}, function (err, user) {
    if (err) return next(err);
    console.log(user);
    if (user) {
      res.render('signup', { errorMessage: "Username already exists, choose another"});
    } else {
      // Create new user, hashPass not hashed yet
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username: username,
        password: hashPass,
      })
      newUser.save((err) => {
        if (err) { return next (err)}
        res.redirect('/');

      })
    }
  })
})


module.exports = router;
