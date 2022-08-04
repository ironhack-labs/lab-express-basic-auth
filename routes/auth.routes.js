const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require('../models/User.model');
const mongoose = require('mongoose');
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard');


// rota para fazer o signin
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
  });
  
  router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('auth/signup', {
        errorMessage: 'All fields are mandatory. Please provide your username and password',
      });
      return;
    }

bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({ username, password: hashedPassword });
    })
    .then(() => res.redirect('/profile'))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log(err);
        res.status(500).render('auth/signup', { errorMessage: err.message });
      } else if (err.code === 11000) {
        console.log(err);
        res.status(500).render('auth/signup', {
          errorMessage:
            'Please provide a unique username. The one you chose is already taken',
        });
      } else {
        next(err);
      }
    });
});

// rota para fazer o logout
router.get('/logout', (req, res, next) => {
    res.render('auth/logout');
  }); 



// rota para o login e manter loggado ate ao logout
router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    console.log(req.session);
  
    if (!username || !password) {
      res.render('auth/login', {
        errorMessage: 'All fields are mandatory. Please provide your username and password',
      });
      return;
    }
    User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Username was not found',
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        //here password is the one coming from the frontend form, user.password is the hashed password we have stored in the db

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

router.get('/profile', (req, res, next) =>
  res.render('auth/profile', { user: req.session.currentUser })
);

router.get('/main', isLoggedIn, (req, res, next) => res.render('mainprofile'));
router.get('/private', isLoggedIn, (req, res, next) => res.render('private'));

module.exports = router;

