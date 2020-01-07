const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');


router.get('/', (req, res, next) => {
  res.render('signup');
});

router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render('index')
    return;
  }

  User.findOne({'username': username})
  .then(nameUser => {
    if (nameUser !== null) {
        res.render('index')
        return;
    };
  User.create({
    username,
    password: hashPass,
  })
  .then(() => {
    res.redirect('/login');
  })
  .catch(error => {
    console.log(error);
  })
  })

});

module.exports = router;