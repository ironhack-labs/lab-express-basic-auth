const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const User = require('../models/User.model');
saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
const {username, password} = req.body;

bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
        console.log(`Password hash: ${hashedPassword}`);
        return User.create({
    username,
    password: hashedPassword,
});
})
.then((createdUser) => {
    console.log('Newly created user:', createdUser);
    res.redirect('/userProfile')
})
.catch((error) => next(error));
});

router.get('/userProfile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });


router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {


//below is placed inside login so that session can start on login
    console.log('SESSION =====> ', req.session);

  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both username and password to login.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
     
      if (!user) {

        res.render('auth/login', {
          errorMessage: 'Username is not registered. Try with other username.'
        });
        return;
      }
      else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});


router.get('/main', (req, res) => res.render('main.hbs'));

router.get('/private', isLoggedIn, (req, res) => res.render('private.hbs'));


module.exports = router;