const express = require('express');

const router = express.Router();

router.get('/private', (req, res, next) => {
  res.render('private/private');
});

module.exports = router;