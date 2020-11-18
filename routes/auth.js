const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const { Router } = require('express');

// go to signup page
router.get('/signup', (req, res) => {
    res.render('signup');
})

// go to login page
router.get('/login', (req, res) => {
    res.render('login');
})

// login post
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.findOne({username: username})
      .then(found => {
          if(found === null) {
              res.render('login', {message: 'Invalid credentials'})
          }
          if(bcrypt.compareSync(password, found.password)) {
            req.session.user = found;
            res.redirect('/')
          } else {
            res.render('login', {message: 'Invalid credentials'})
          }
      })
})

// signup post
router.post('/signup', (req, res, next) => {
    const {username, password} =req.body;
    if(password.length < 8) {
        res.render('signup', {message: 'Your password must be 8 chars min'});
    }
    if(username === '') {
        res.render('signup', {message: 'Your username cannot be empty'});
    }
    User.findOne({username: username})
      .then(found => {
          if(found !== null) {
              res.render('signup', {message: 'This username is already taken'})
          } else {
              const salt = bcrypt.genSaltSync();
            //   console.log(salt);
              const hash = bcrypt.hashSync(password, salt);
              User.create({username: username, password: hash})
                .then(dbUser => {
                    req.session.user = dbUser;
                    res.redirect('/');
                })
                .catch(err => {
                    next(err);
                })
          }
      })
  })
  
router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            next(err);
        } else {
            res.redirect('/')
        }
    })
});

module.exports = router