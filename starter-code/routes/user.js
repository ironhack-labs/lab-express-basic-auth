var express = require('express');
var router = express.Router();
const auth = require('../helpers/auth')  //where checkLoggedIn() is located




/* GET users listing. */
router.get('/', auth.checkLoggedIn('/login'), function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
