const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', (req, res, next) => {

if(req.session.currentUser.username) {
    res.render('auth/private')
  } else {
    res.redirect('/auth/login')
  }
})

router.get('/main', (req, res, next) => {
 
if(req.session.currentUser.username) {
    res.render('auth/main')
  } else {
    res.redirect('/auth/login')
  }
})

module.exports = router;
