const express = require('express');

const router = express();

router.get('/main', (req, res) => {
  res.render('main', { currentUser: req.session.currentUser });
});

router.get('/private', (req, res) => {
  res.render('private', { currentUser: req.session.currentUser });
});

module.exports = router;
