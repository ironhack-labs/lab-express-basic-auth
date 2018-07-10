'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.session.currentUser) {
    res.render('auth/signup');
    return;
  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
