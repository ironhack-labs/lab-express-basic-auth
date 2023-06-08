const bcrypt = require('bcryptjs');
const saltRounds = 10;

const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

router.get("/signup", (req, res, next) => {
    res.render('auth/signup')
});

router.post("/signup", (req, res, next) => {
    console.log('req.body', req.body)
    const { username, password } = req.body;

    bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect(`/auth/profile/${userFromDB.username}`)
    })
    .catch(error => next(error));

});

router.get("/profile/:username", (req, res, next) => {
    User.findOne({ username: req.params.username })
        .then(foundUser => {
            console.log('foundUser', foundUser)
            res.render('auth/profile', foundUser)
        })
        .catch(err => console.log(err))
    
});

module.exports = router;