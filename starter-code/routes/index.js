const express = require('express');
const router  = express.Router();

const userLoggedIn = (req, res, next) => {
  if(req.session.currentUser){
    next()
  } else {
    res.redirect('/auth/login');
  }
} 
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', userLoggedIn, (req, res, next) => {
  res.render('main');
});

router.get('/private', userLoggedIn, (req, res, next) => {
  res.render('private')
});


module.exports = router;
