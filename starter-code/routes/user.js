let express = require('express');
let User = require('../models/User');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user');
});

module.exports = router;
