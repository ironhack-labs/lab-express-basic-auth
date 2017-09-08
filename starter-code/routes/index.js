const express = require('express');
const router = express.Router();
const User = require("../../models/user");

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('sign-up/index');
});

module.exports = router;
