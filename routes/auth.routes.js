// REQUIRES
const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
 
// CODE SKIPED
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
// MODEL IMPORT
const User = require('../models/User.model');
/**********************************************************************/

/**********************************************************************/
/* F O R M - S I G N U P */
// GET route ==> to display the signup form
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
  //console.log('The form data: ', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
    return;
  }
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        // username: username
        username,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      // console.log('Newly created user is: ', userFromDB);
      res.redirect('/userProfile');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username need to be unique. Either username is already used.'
        });
      } else {
        next(error);
      }
    }); // close .catch()
})

/********************************************************/
/* U S E R - P R O F I L E */
router.get('/userProfile', isLoggedIn, (req, res) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

/********************************************************/
/* L O G I N  */
// GET login route
router.get('/login', (req, res) => res.render('auth/login'));
// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User
    .findOne({ username }) //<== check if there's user with the provided username
    .then(user => {
      if (!user) {
        res.render('auth/login', { 
          errorMessage: 'Username is not registered. Try with other username.' 
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
       // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });
         //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

/********************************************************/
/* L O G O U T  */
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});


/********************************************************/
/* R A N D O M  */
router.get("/main", (req, res) => {
  res.render("main");
});

router.get("/private", (req, res) => {
  res.render("private");
});
/********************************************************/
/* E N D */
module.exports = router;