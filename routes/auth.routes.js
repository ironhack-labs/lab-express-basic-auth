
const express = require("express");
const User = require('../models/User.model');
const bcryptjs = require("bcryptjs")
const router = express.Router();


router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res) => {

  const { username, password } = req.body;
  const saltRounds = 10
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
    })
    .catch(error => next(error));
});


module.exports = router;