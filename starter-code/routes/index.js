const express = require('express');

const router = express.Router();
const { loginCheck } = require('../utils');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { loggedIn: req.session.user });
});

router.get('/private', loginCheck(), (req, res) => {
  res.render('private', { user: req.session.user });
});

router.get('/main', (req, res) => {
  res.render('main');
});

module.exports = router;
