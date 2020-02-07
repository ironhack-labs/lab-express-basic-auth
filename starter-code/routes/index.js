const express = require('express');
const bcrypt = require("bcrypt");
const router  = express.Router();
const Users = require("../models/Users");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  if(req.body.username.trim() === "" || req.body.password.trim() === "") {
    let error = "Please fill in the username and password.";
    res.render('signup', {error});
    return;
  }
  Users.findOne({ username: req.body.username })
  .then(foundUser => {
    if(foundUser) {
      let error = "User already exists.";
      res.render('signup', {error});
      return;
    } else {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password, salt);
      Users.create({
        username: req.body.username,
        password: hash
      })
      .then(() => {
        res.redirect('/login')
      });
    }
  });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  if(req.body.username.trim() === "" || req.body.password.trim() === "") {
    let error = "Please fill in the username and password.";
    res.render('login', {error});
    return;
  }
  Users.findOne({ username: req.body.username })
  .then(foundUser => {
    if(foundUser) {
      if(bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser._id;
        res.redirect('/private');
      } else {
        let error = "Password is not correct.";
        res.render('login', {error});
      }
    } else {
      let error = "User not found.";
      res.render('login', {error});
    }
  });
});

router.get('/private', (req, res, next) => {
  if(req.session.currentUser) {
    Users.findById(req.session.currentUser)
    .then(userData => {
      res.render('private', {username: userData.username});
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/main', (req, res, next) => {
  if(req.session.currentUser) {
    Users.findById(req.session.currentUser)
    .then(userData => {
      res.render('main');
    })
  } else {
    res.redirect('/login');
  }
});



module.exports = router;
