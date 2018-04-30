const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('site/home-page');
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});

router.get('/secret', (req, res, next) => {
  const username = req.session.currentUser.username;
  res.render('site/secret', { username: username });
});

module.exports = router;
