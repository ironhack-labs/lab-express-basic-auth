const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');
//const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


    router.get('/signup', (req, res, next) => {
res.render('auth/signup')
})

    router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('auth/signup', {
        errorMessage: 'Both fields are required. Please insert a username and a password',
      });
      return;
    }
  
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({username, password: hashedPassword});
      })
      .then(() => res.redirect('/profile'))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          console.log(err);
          res.status(500).render('auth/signup', {errorMessage: err.message});
        } else if (err.code === 11000) {
          console.log(err);
          res.status(500).render('auth/signup', {
            errorMessage:
              'Please provide a unique username or email. The one you chose is already taken',
          });
        } else {
          next(err);
        }
      });
  });

    router.get('/login', (req, res, next) => {
    res.render('auth/login')
    });

    router.post('/login', (req, res, next) => {
        const { username, password } = req.body;
        console.log(req.session);
      
        if (!username || !password) {
          res.render('auth/login', {
            errorMessage: 'Both fields are required. Please insert a username and a password',
          });
          return;
        }
      
        User.findOne({ username })
          .then((user) => {
            if (!user) {
              res.render('auth/login', {
                errorMessage: 'Username does not exist',
              });
              return;
            } else if (bcrypt.compareSync(password, user.password)) {
              req.session.currentUser = user;
              res.redirect('/profile');
            } else {
              res.render('auth/login', {
                errorMessage: 'Incorrect password',
              });
            }
          })
          .catch((err) => next(err));
      });
      
       router.get('/profile', (req, res, next) => {
        res.render('auth/profile', { user: req.session.currentUser });
       });
       
      /*
      router.get('/logout', (req, res, next) => {
        req.session.destroy((err) => {
          if (err) next(err);
          res.redirect('/');
        });
      }); */



















module.exports = router;