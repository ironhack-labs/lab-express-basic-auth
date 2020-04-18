const express = require('express');
const router = express.Router();

// import controllers
const {
  signupView,
  signupProcess,
  logoutProcess,
  loginView,
  loginProcess,
  mainView,
  privateView,
} = require('../controllers/auth');

// Middleware session
function checkSession(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

// index page
router.get('/', (req, res, next) => {
  res.render('index');
});

// Auth routes
router.get('/signup', signupView);
router.post('/signup', signupProcess);
router.get('/login', loginView);
router.post('/login', loginProcess);
router.get('/logout', logoutProcess);

//
router.get('/main', mainView);
//router.get('/private ',checkSesion, privateView);
router.get('/private',checkSession ,privateView );


module.exports = router;
