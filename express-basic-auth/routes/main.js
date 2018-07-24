var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('main');
});

module.exports = router;
