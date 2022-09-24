const router = require('express').Router();

const { isLoggedIn } = require('../middleware/route-guard.js');

/* GET Profile-Page */
router.get('/userprofile', isLoggedIn, (req, res, next) => {
  res.render('user/profile-page', { userInSession: req.session.currentUser });
});

// Iteration 3
router.get('/content/main', isLoggedIn, (req, res, next) => {
  res.render('content/main', { userInSession: req.session.currentUser });
});

router.get('/content/private', isLoggedIn, (req, res, next) => {
  res.render('content/private', { userInSession: req.session.currentUser });
});

module.exports = router;
