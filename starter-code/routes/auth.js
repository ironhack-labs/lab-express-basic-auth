const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('entreeee');


  if(username === '' || password === '') {
    res.render('auth/signup',{
      errorMessage: 'You have to introduce a password and a user',
    });
    return;
  }



  User.findOne({'username': username})
  .then(user => {
    if (user !== null){
      res.render('auth/signup',{
        errorMessage: 'The username is already taken, please choose another one'
      });
    return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass,
    });

    newUser.save()
    .then(user => {
      res.redirect('/')
    }).catch(err=>{
      console.log(err);
    })
  })
});


router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next)=>{
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === ''){
    res.render('auth/login',{
      errorMessage: 'Please fill out all the fields'
    });
    return;
  }

  User.findOne({'username': username})
  .then(user => {
    if(!user){
      res.render('auth/login', {
        errorMessage: 'The user do not exist'
      });
      return;
    }
    if(bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user;
      res.redirect('/')
    } else {
      res.render('auth/login',{
        errorMessage: 'La contraseña es incorrecta'
      })
    }
  })
  .catch(err => {
    console.log(err);
  })


});

module.exports = router;
