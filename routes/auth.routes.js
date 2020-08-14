const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

// Main and Private
const express = require('express');
const router = express.Router();

const loggedIn = (req,res,next) => {
    console.log(req.session)
    if(!req.session.currentUser){
        return res.send('Restricted')
    }
    next()
  }

router.get('/main', loggedIn, (req, res) => res.render('protected/main'));
router.get('/private', loggedIn, (req, res) => res.render('protected/private'));
router.get('/userProfile', loggedIn, (req, res) => res.render('user/userProfile', req.session.currentUser));



router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render('auth/signup', { errorMessage: 'Username & Password Required' });
      return
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('auth/signup', { errorMessage: 'Invalid Password' });
      return;
    }

    bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('New user: ', userFromDB);
        res.render('user/userProfile', userFromDB);
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
            errorMessage: 'Invalid Username'
          });
        } else {
          next(error);
        }
      }); 
  });

  module.exports = router;