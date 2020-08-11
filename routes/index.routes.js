const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcryptjs = require('bcrypt');

const saltRounds = 10;

const User = require('../models/User.model');

/* GET home route */
router.get('/', (req, res, next) => {
    res.render('index');
});

/* GET signup route */
router.get('/signup', (req, res, next) => {
    res.render('auth-views/signup');
});

/* POST signup route */
router.post('/signup', (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth-views/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
        .status(500)
        .render('auth-views/signup', { 
            errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' 
        });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {

            return User.create({
                username,
                passwordHash: hashedPassword
            });
        })
        .then(userDoc => {
            console.log(userDoc);
            res.redirect('/');
        })
        .catch(error => {

            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth-views/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
                res.status(500).render('auth-views/signup', {
                   errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                });
            } else {
            next(error);
            }
          });

});

/*GET login route */
router.get('/login', (req, res, next) => {
    res.render('auth-views/login');
})

/*POST login route*/
router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    const { username, password } = req.body;    

    if (!username || !password) {
      res.render('auth-views/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    User.findOne({ username })
      .then(user => {
        if (!user) {
            res.render('auth-views/login', { errorMessage: 'Username is not registered. Try with other email.' });
            return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //  res.render('users/user-profile', { user });
            req.session.currentUser = user;
            console.log({currentUser: req.session})
            res.redirect('/userProfile');
        } else {
            res.render('auth-views/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', {userInSession: req.session.currentUser});
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
