const express = require('express');
const router = express.Router();
const User =
  /* GET home page */
  router.get('/', (req, res, next) => {
    res.render('index');
  });

router.get('/private', (req, res, next) => {
  if (!req.session.user) {
    res.render('user/private', { errorMessage: 'Access restricted' });
    return;
  }

  res.render('user/private', req.session.user);
  return;
});

router.get('/main', (req, res, next) => {
  if (!req.session.user) {
    res.render('user/main', { errorMessage: 'Access restricted' });
    return;
  }

  res.render('user/main');
  return;
});

module.exports = router;
