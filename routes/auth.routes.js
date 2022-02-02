const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');

// require custom middleware for protected routes
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
//I have actually used these in index for main and private to test my understanding

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs');
})

router.post('/signup', (req, res ,next) => {
    const {username, password} = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        return User.create({username, password: hashedPassword})
    })
    .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.render('users/user-profile', { userFromDB });
      })
    .catch(err => console.log('Error when creating user', err));    
})

//Get route for login
router.get('/login', (req, res, next) => res.render('auth/login'));

//Post route for login
router.post('/login', (req, res, next) => {
    const {username, password} = req.body;

    if(username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both username AND password to login'
        });
        return;
        }

    User.findOne({ username })
    .then(user => {
        if (!user) {
            res.render('auth/login', { errorMessage: 'Username not found, please try again' });
            return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/userProfile');
        } else {
            res.render('auth/login', {errorMessage: 'Incorrect password'});
        }
    })
    .catch(error => next(error));
})

//get for user profile page
router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', {userInSession: req.session.currentUser});
    console.log(req.session.currentUser);
});

//POST route for logout
router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

module.exports = router;