const router = require('express').Router()
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const { isLogged, cantIfIsLogged } = require('./../middlewares/auth.middleware')

// SING UP

router.get('/signup', cantIfIsLogged, (req, res) => res.render('auth/sign-up'));

router.post('/signup', cantIfIsLogged, (req, res, next) => {
    const { username, password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            username,
            password: hashedPassword
          });
        })
        .then(userFromDB => {
            res.redirect('/auth/userProfile');
        })
    .catch(error => next(error));
  });

router.get('/userProfile', isLogged, (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });

// LOGIN

router.get('/login', cantIfIsLogged, (req, res) => res.render('auth/login'));

router.post('/login',cantIfIsLogged, (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }

    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/auth/userProfile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

// LOG OUT
router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });


module.exports = router