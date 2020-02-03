const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use((req, res, next) => {
  req.session.currentUser ? next() : res.redirect('/login');
});

router.get('/secret', (req, res) => {
  res.render('auth/secret');
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/login');
  });
});

module.exports = router;
