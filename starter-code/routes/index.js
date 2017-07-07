var express = require('express');
var router = express.Router();
// const tweetnacl = require("tweetnacl");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

module.exports = router;
