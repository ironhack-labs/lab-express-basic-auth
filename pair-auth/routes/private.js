const express = require('express');
const router = express.Router();
const privateMiddleware = require('../middleware/privateMiddleware');

router.get('/', privateMiddleware.requireAnon, (req, res, next) => {
  res.render('private');
});

module.exports = router;
