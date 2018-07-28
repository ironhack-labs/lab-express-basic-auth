const express = require('express');

const router = express.Router();

router.get('/main', (req, res, next) => {
  res.render('site/main');
});

router.get('/private', (req, res, next) => {
  res.render('site/private');
});

module.exports = router;
