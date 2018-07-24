var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('private');
});

module.exports = router;
