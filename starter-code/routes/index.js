const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  let {username, password} = req.body;
  if(username !== "" && password !== ""){
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    User.create({username, password}, {new: true})
    .then((user) => res.render('/', user));
  }
  res.render('signup');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let {username, password} = req.body;
  res.render('login');
});


module.exports = router;
