const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

//Connect auth to app.js and use it to create other routes
const route = require('./auth');
router.use('/', route)


//Middleware that checks if the user is logged in
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    res.redirect("/login");         
  } 
});       

//GET main page (only for logged in users)
router.get('/main', (req, res, next) => {
  res.render('main');
});

//GET private page (only for logged in users)
router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
