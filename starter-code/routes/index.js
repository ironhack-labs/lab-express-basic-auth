const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/private', (req, res, next) => {
  if(req.session.user) {
    res.render('auth/private')
  } else {
    res.redirect('/auth/login')
  }
})

router.get('/main', (req, res, next) => {
  if(req.session.user) {
    res.render('auth/mainpage')
  } else {
    res.redirect('/auth/login')
  }
})

module.exports = router;
