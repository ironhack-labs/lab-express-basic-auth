const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});

router.get('/main', (req, res) => {
  res.render('main');
});

router.get('/private', (req, res) => {
  res.render('private');
});

module.exports = router;
