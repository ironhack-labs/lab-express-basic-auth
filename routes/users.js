var express = require('express');
var router = express.Router();
const User = require('../models/users');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
