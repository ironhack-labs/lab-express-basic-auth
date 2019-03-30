const express = require('express');
const router = express.Router();

// the /member route
router.get('/', (req, res, next) => {
  res.render('./member/index.hbs');
});

router.get('/main', (req, res, next) => {
  res.render('./member/main.hbs');
});

router.get('/private', (req, res, next) => {
  res.render('./member/private.hbs');
});

module.exports = router;