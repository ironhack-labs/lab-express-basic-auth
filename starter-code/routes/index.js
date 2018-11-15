const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



router.get('/secret', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('secret', { theUser: req.session.currentUser });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
