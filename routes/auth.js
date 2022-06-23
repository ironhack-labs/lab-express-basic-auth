const { Router } = require("express");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


const saltRounds = 13;
const router = Router();

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup');
  });
  
  
  router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;
  
    
    if (!username || !password) {
      res.render('auth/signup', {
        errorMessage:
          'enter your username, email and password.',
      });
      return;
    }
  
    
   
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(400).render('auth/signup', {
        errorMessage:
          'The password must contain uppercase and lowercase letter, digits and be at least 6 characters long',
      });
      return;
    }
  
    try {
     
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({username, password: hash });
      res.status(400).redirect('/profile');
    }catch(Error => {
        if (Error instanceof mongoose.Error.ValidationError) {
          res.status(400).render('auth/signup', { errorMessage: Error.messag });
        } else if (Error.code === 11000) {
          res.status(400).render('auth/signup', {
             errorMessage: 'Username and password need to be unique. Either username or password is already used.'
          });
        } else {
          next(Error);
        }
      
         
  router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/signin', { error: req.session.error });
  });
  
  router.get('/profile', isLoggedIn, (req, res) => {
  res.render('users/user-profile', { user: req.session.currentUser });
  });
  
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    
    if (!username || !password) {
      res.render('auth/signin', {
        errorMessage: 'Please fill all the fields',
      });
      return;
    }
  
    
    User.findOne({ username: username }).then((userFromDb) => {
      
      if (!userFromDb) {
        res.render('auth/signin', {
          errorMessage:
            'no username please create an account ',
        });
        return;
      }
  
      
      if (!bcrypt.compareSync(password, userFromDb.password)) {
        res.render('auth/signin', {
          errorMessage: 'Invalid password',
        });
        return;
      }
  
      req.session.currentUser = userFromDb;
      res.redirect('/profile');
    });
  });
 
  

  router.get('/main', isLoggedIn, (req, res) => {
    res.render('views/main', { user: req.session.currentUser });
     });
     
  
 
     router.get('/private', isLoggedIn, (req, res) => {
       res.render('views/private', { user: req.session.currentUser });
        });




  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/login');
    });
  });
  
  
       
  
  module.exports = router;
