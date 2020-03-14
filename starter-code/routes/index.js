const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* Pages for members only */
router.get('/main', (req, res, next) => {
  if(req.session.user) {
    res.render('main')
  } else {
    res.redirect('/auth/login')
  }
})

router.get('/private', (req, res, next) => {
  if(req.session.user) {
    res.render('private')
  } else {
    res.redirect('/auth/login')
  }
})

module.exports = router;
