const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const path = require("path");
const debug = require('debug')('basic-auth:' + path.basename(__filename));
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
})

router.get('/signup', (req, res) => {

  res.render('auth/signup')
});

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === ""){
    res.render('auth/signup', {
      errorMessage: "Indicate a username and password to sign up please!"
    });
    return;
  }

  User.findOne({'username': username }, 'username', (err, user) => {
    if (user != null){
      res.render('auth/signup', {
        errorMessage: "Ya hay UN sexy boyanders! Busca otro username!"
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect('/');
    })
  });
});

router.get('/login', (req, res) => {
  res.render('auth/login')
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === ""){
    res.render('auth/login', {
      errorMessage: "Indicate a username and password to log in please!"
    });
    return;
  }

  User.findOne({'username': username }, (err, user) => {
    if (err || !user){
      res.render('auth/login', {
        errorMessage: "The username does not exist!"
      });
      return;
      }

    if(bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user;
      res.redirect('/');
    }else{
      res.render('auth/login', {
        errorMessage: "Incorrect password"
      });
    }

    });
});

router.get('/logout', (req, res, next)=> {
  req.session.destroy((err) => {
    res.redirect('/');
  })
})

module.exports = router;
