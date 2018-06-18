const express = require('express');
const router  = express.Router();

/* GET landing page */
router.get('/', (req, res, next) => {
  let loggedIn = {isLogged: false};
  if (req.session.currentUser) {
    loggedIn.isLogged = true
  }
  res.render('index', loggedIn);
});

// middleware to check if user is logged in
let isUserLoggedIn = (req, res, next) => {
  if ( req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page */
router.get('/home', isUserLoggedIn,(req, res, next) => {
  res.render('home');
});

/* GET main page */
router.get('/main', isUserLoggedIn, (req, res, next) => {
  res.render('main');
});

/* GET private page */
router.get('/private', isUserLoggedIn, (req, res, next) => {
  res.render('private');
});

/* logout */
router.get('/logout', (req, res, next) => {
  req.session.destroy( err => {
    res.redirect('/');
  })
});


module.exports = router;
