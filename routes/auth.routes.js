const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 6;
const User = require('../models/User.model');
const {isLoggedIn} = require('../middleware/route-guard');
 
router.get('/signup', (req, res) => res.render('auth/signup'));
router.get('/login', (req, res) => res.render('auth/login'));

router.post('/signup', (req, res, next) => {
    const {email, password } = req.body;
    if (!email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your email and password.' });
        return;
      }
 
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
            email,
            passwordHash: hashedPassword
        });
      })

      .then(userFromDB => {
        res.redirect('/userProfile');
      })

      .catch(error => next(error));
  
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    console.log('SESSION =====> ', req.session);
   
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }

    User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        res.render('users/user-profile', { user });
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

/* router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
}); */

router.get('/userprofile', isLoggedIn, (req, res) => {
    const user = req.session.user;
    console.log(user);
  
    res.render('users/user-profile', user);
  });
  
  router.post('/logout', (req, res, next) => {
    if (!req.session) res.redirect('/');
  
    req.session.destroy((err) => {
      if (err) next(err);
      else res.redirect('/');
    });
  });


 
module.exports = router;