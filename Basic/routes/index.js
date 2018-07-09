const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private',(req, res, next) => {
  if(req.session.currentUser){
    res.render('private');
  }else{
    res.redirect('/');
  }
})

router.get('/auth/signup', (req, res, next) => {
  res.render('auth/signup');
})

router.get('/auth/login', (req, res, next) => {
  res.render('auth/login');
})

module.exports = router;
