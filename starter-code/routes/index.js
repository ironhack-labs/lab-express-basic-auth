var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('auth/secret', function(req, res, next) {
  res.render('secret');
});


module.exports = router;
