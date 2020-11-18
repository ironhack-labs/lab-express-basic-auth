const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model'); // requiere Model for user 
const bcryptjs = require('bcryptjs'); //encryption library
const saltRounds = 10;               //gensalt


// route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));


// route ==> to display user -profile
router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });


////// SIGN UP /////////

router.post('/signup',(req, res) => {
const { username, password, email } = req.body; 
if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
    User.findOne({ $or: [{ username }, { email }]} ).then(foundUser => {
      if (foundUser) {
        console.log('a user was found:', foundUser);
        return res.render('auth/signup', {
          errorMessage: 'Username or Email is already in use'
        })
      }
  
      bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
          return User.create({
            username,
            email,
            passwordHash: hashedPassword
          });
        })
        .then(User => {
          req.session.currentUser = User;
          res.redirect('/userProfile'); 
        })
    })
    .catch(err => {
      res.render('auth/signup', { errorMessage: err.message});
    })
  })
  

  
   //////////// L O G I N ///////////
 
// route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
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
            req.session.currentUser = user;
            res.redirect('/userProfile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });
  
module.exports = router;