const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const bcryptSalt = 10;


router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

 if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

 User.findOne({ username: username }, 'username', (err, user) =>{

   if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

   const newUser = new User({
      username: username,
      password: hashPass,
    })

   newUser.save((err) => {
      if (err) { return next(err) }
      res.redirect('/');
    })
  })
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

 if (username == '' || password == '') {
    return res.render('auth/login', {
      errorMessage: 'Indicate a username and a password to log in',
    })
  }

 User.findOne( { username: username }, (err, user ) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }

   if ( bcrypt.compareSync( password, user.password ) ) {
      req.session.currentUser = user;
      res.redirect('/secret');
    } else {
      res.render('auth/login', {
        errorMessage: 'Incorrect password',
      })
    }


 })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  })
})

router.get('/main',(req,res,next)=>{
  res.render('main');
})

router.get('/private',(req,res,next)=>{
  res.render('private');
})

router.get('/index',(req,res,next)=>{
  res.render('index');
})
module.exports = router;
