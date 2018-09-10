const express = require('express');
const router  = express.Router();
const middleAuth = require('../middle/auth');

/* GET home page */
router.get('/', (req, res, next) => {

  const username = req.session.currentUser ? req.session.currentUser.username : null;

  res.render('index', {
    username
  });
});

/* GET main page */
router.get('/main', middleAuth, (req, res, next) => {
    res.render('content/main');
});

/* GET private page */
router.get('/private', middleAuth, (req, res, next) => {
    res.render('content/privcontent');
});

module.exports = router;
