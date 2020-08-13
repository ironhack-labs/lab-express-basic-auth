const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');


//SIGNUP
router.get('/signup', (req,res) => {
    res.render('auth/sign-up')
})

router.post('/signup', (req,res,next) => {
    const { username, email, password } = req.body;

    if (!username | !email, !password) {
        res.render('auth/sign-up', {errorMessage: 'All fields are required! Provide username, email and password'} )
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('auth/sign-up', { errorMessage: 'Create a stronger password. It needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password,salt))
    .then(hashedPassword => {
        return User.create({
            username,
            email,
            passwordHash: hashedPassword
        })
    })
    .then(userFromDb => {
        console.log('new user created: ', userFromDb);
        res.redirect('/');
    })
    .catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/sign-up', { errorMessage: err.message });
          } else if (err.code === 11000) {
            res.status(500).render('auth/sign-up', {
              errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
          } else {
            next(err);
          }
        }); 
})

//LOGIN
router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req,res,next) => {
  const {email, password} = req.body;

  if(email === '' || password === '') {
    res.render('auth/login', {errorMessage:'Please enter both fields'})
    return
  }

  User.findOne({email})
  .then(user => {
    if (!user) {
      res.render('auth/login', {errorMessage: 'This email is not registered yet'});
      return
    } else if(bcryptjs.compareSync(password, user.passwordHash)) {
      req.session.currentUser = user
      res.redirect('/user-profile')
    } else {
      res.render('auth/login', {errorMessage: 'Password is incorrect, try again'})
    }
  })

  .catch(err => next(err))

})

router.get('/user-profile', (req,res,next) =>{
  if (req.session.currentUser) {
    res.render('user/user-profile', { user: req.session.currentUser });
  } else {
    res.redirect("/login");
  }
})

router.get('/main', (req,res,next) =>{
  if (req.session.currentUser) {
    res.render('user/main', { user: req.session.currentUser });
  } else {
    res.redirect("/login");
  }
})

router.get('/private', (req,res,next) =>{
  if (req.session.currentUser) {
    res.render('user/private', { user: req.session.currentUser });
  } else {
    res.redirect("/login");
  }
})



module.exports = router;