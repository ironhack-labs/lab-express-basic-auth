const mongoose = require('mongoose');
const router = require('express').Router();
const { isLoggedIn } = require('../middleware/route-guard');
const { getUserName } = require('../helpers/helpers');
const User = require('../models/User.model');

//GET to reender main page
router.get('/main', isLoggedIn, (req, res) => {
  res.render('users/user-main');
});

//GET to render
router.get('/private', isLoggedIn, (req, res) => {
  res.render('users/user-private');
});

//GET to render user's home page / profile page
router.get(`/userprofile`, isLoggedIn, (req, res) => {
  console.log('TEST');
  const currentUserName = getUserName(req, res);
  console.log('USER', req.session?.user);
  if (req.session?.user) {
    res.render('users/user-profile', { userData: currentUserName });
  } else {
    res.render('auth/user-login');
  }
});

module.exports = router;
