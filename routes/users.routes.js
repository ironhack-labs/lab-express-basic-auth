const express = require('express');
const router = express.Router();

function isAuthenticated (req, res, next){
  if (req.session.loggedInUser){
    return next();
  }
  res.redirect('/');
}

router.get('/profile', isAuthenticated, (req, res) =>{res.render('users/profile.hbs', {user: req.session.loggedInUser})});
router.get('/private', isAuthenticated, (req, res) =>{res.render('users/private.hbs')});
module.exports = router