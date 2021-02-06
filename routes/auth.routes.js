const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');


router.get('/signup', (req, res) =>{
    res.render('./auth/signup')
})
router.post('/signup', (req, res, next) =>{
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('./auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' 
    });
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
  const salt = bcryptjs.genSaltSync(saltRounds);
  const hash1 = bcryptjs.hashSync(password, salt);
     User.create({
        username,
        password : hash1
    })
     .then(userFromDB => {
      res.render('./user/profile')
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username and email need to be unique. Either username or email is already used.'
          });
        } else {
          next(error);
        }
      });
})

router.get('/login', (req, res) =>{
    res.render('./auth/login');
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

if (username === '' || password === '') {
    res.render('./auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('./auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
          req.session.User = user;
        res.redirect('/userProfile');
      } else {
        res.render('./auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});
router.get('/userProfile', (req, res) => {
    res.render('user/profile', { userInSession: req.session.User });
 });

 router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
  router.get('/main', (req, res)=>{
      if(!req.session.User){
      res.render('auth/login', {errorMessage : 'Você não esta logado e não pode acessar essa paguna!'});
    }else {
        res.render('user/main');
    }
  });
  router.get('/private', (req, res)=>{
    if(!req.session.User){
    res.render('auth/login', {errorMessage : 'Você não esta logado e não pode acessar essa paguna!'});
  }else {
      res.render('user/private');
  }
});

module.exports = router;
