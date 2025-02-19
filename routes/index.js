const router = require("express").Router();
const bcryptjs = require("bcryptjs")
const saltRounds = 10
const User = require('../models/User.model');

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET signup page */
router.get('/signup', isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

/* POST signup page */
router.post('/signup', isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      res.redirect('/userProfile/' + userFromDB.username);
    })
    .catch(error => next(error));
});

router.get('/userProfile', isLoggedIn, (req, res) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

// GET route ==> to display the login form to users
router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post('/login', isLoggedOut, (req, res, next) => {
  console.log('SESSION =====> ', req.session);
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
        console.log("Email not registered. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });
 
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        console.log("Incorrect password. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

router.get('/main', isLoggedIn, (req, res) => res.render('main'));
router.get('/private', isLoggedIn, (req, res) => res.render('private'));

module.exports = router;
