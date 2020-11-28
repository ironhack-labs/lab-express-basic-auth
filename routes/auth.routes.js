const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
const saltRound = 10

/* GET Signup page */
router.get('/signup', (req, res, next) => res.render('auth/signup'));

/* POST Signup page */
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body
    if(!username || !password){
      res.render('auth/signup',{username, errorMessage: 'You must supply a Username and Password!'})
      return;
    }
  
    bcrypt.genSalt(saltRound)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hash) =>{
      req.body.password = hash
      User.create(req.body)
        .then((user) => {
            req.session.currentUser = user;
            res.redirect('/main')
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
          } else if (error.code === 11000) {
            res.render('auth/signup', {
              errorMessage:
                'Username and email need to be unique. Either username or email is already used.',
            });
          } else {
            next(error);
          }
        });
    })  
    .catch((err) => next(err));
});
    
router.get('/login', (req,res)=>{
  res.render('auth/login')
})


router.post('/login', (req, res,next)=>{
  const {username , password} = req.body
  if(!username || !password){
    res.render('auth/login', {username,
      errorMessage: 'Please enter both, username and password to login.',
    });
    return;
  }

  User.findOne({ username })
  .then((user) => {
    if (!user) {
      res.render('auth/login', { errorMessage: 'username does not exist.' });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('main')
    } else {
      res.render('auth/login', {username, errorMessage: 'Incorrect password.' });
    }
  })
  .catch((error) => next(error));
});

router.get('/main', (req,res)=>{
  console.log(req.session)
  res.render('users/user-main', { userInSession: req.session.currentUser })
})

router.get('/private', (req,res)=>{
  console.log(req.session)
  res.render('users/user-private', { userInSession: req.session.currentUser })
})

router.post('/logout',(req,res,next)=>{
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
