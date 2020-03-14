const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
let error = null;

router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);

  User.findOne({
    username
  })
  .then((user) => {
    console.log(`Response is `, JSON.stringify(user));
    if (user) {
      console.log(`Inside if with response ${user}`);
      res.render('index', { error: `Username ${user} already exist foo` });
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      console.log('Creating user', username);
      User.create({
        username,
        password: hashPass
      })
      .then(() => {
        error = null;
        res.redirect("/");
      })
      .catch(error => next(error))
    }
  })
  .catch(error => {
    next(error);
  })
});

module.exports = router;
