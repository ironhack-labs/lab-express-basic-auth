const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/signup', (req, res, next) => {
  const data = {
    action: "signup"
  };
  res.render("index", data);
});

router.post('/signup', (req, res, next) => {
  if (req.body.password.length == 0 || req.body.userName.length == 0) {
    res.json({ error: true });
    return;
  }

  let saltRounds = 10;
  let salt = bcrypt.genSaltSync(saltRounds);
  let encryptedPwd = bcrypt.hashSync(req.body.password, salt);

  User
    .create({ userName: req.body.userName, password: encryptedPwd })
    .then((userGenerated) => {
      console.log("signup success")
    })
    .catch((error) => {
      console.log(error)
    });
});

router.get('/login', (req, res, next) => {
  const data = {
    action: "login"
  };
  res.render("index", data);
});

router.post('/login', (req, res, next) => {
  if (req.body.password.length == 0 || req.body.userName.length == 0) {
    res.json({ error: true });
    return;
  }

  let userName = req.body.userName;
  let password = req.body.password;

  User
    .findOne({ userName: userName })
    .then((userData) => {
      const isAuthorized = bcrypt.compareSync(password, userData.password)

      if (isAuthorized) {
        console.log(`login correct ${userData.userName}`)
        req.session.currentUser = userData;
        res.redirect('/main')
      } else {
        console.log("password incorrect")
      }
    })
    .catch((error) => {
      console.log("user not found")
      console.log(error)
    });
});


module.exports = router;
