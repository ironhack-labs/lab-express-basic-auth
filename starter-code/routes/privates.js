const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.get('/main', authMiddleware('/login'), (req, res, next) => {
  res.render('user/main');
});

router.get('/private', authMiddleware('/login'), (req, res, next) => {
  res.render('user/private');
});

module.exports = router;