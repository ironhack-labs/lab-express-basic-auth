const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/profile', auth('/login'), (req, res, next) => {
  res.render('user/main');
});

module.exports = router;