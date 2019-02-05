const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/signin');
  }
});

router.get('/', (req, res) => {
  res.render('home');
});

module.exports = router;
