const express = require('express');

const router = express.Router();

router.get('/main', (req, res, next) => {
  res.render('private/main');
});

module.exports = router;