const express = require('express');
const User    = require('../models/user');
const bcrypt  = require('bcryptjs');
const router  = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('user/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username === "" || password === "") {
    res.render('user/signup', {error: 'All fields are required'});
    return;
  }
  User.findOne({'username': username})
  .then((user) => {
    if(user !== null) {
      res.render('user/signup', {error: `Sorry, ${username} is no longer available`});
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);
    User.create({username: username, password: hashedPass})
    .then((response) => {
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('user/login');
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username === "" || password === "") {
    res.render('user/login', {error: 'All fields are required'});
    return;
  }
  User.findOne({username: username}, (err, user) => {
    if(err || !user) {
      res.render('user/login', {error: "The username does not exist"});
      return;
    }
    if(bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      console.log(req.session.currentUser);
      res.render('index', {user: req.session.currentUser});
    } else {
      res.render('user/login', {error: 'Incorrect password!'});
    }
  })
});

router.get('/main', (req, res, next) => {
  if(!req.session.currentUser) {
    res.render('user/login', {error: "Please login to see all content"});
    return;
  } else {
    res.render('user/main', {user: req.session.currentUser})
  }
})

router.get('/private', (req, res, next) => {
  if(!req.session.currentUser) {
    res.render('user/login', {error: "Please login to see all content"});
    return;
  } else {
    res.render('user/private', {user: req.session.currentUser})
  }
})












module.exports = router;