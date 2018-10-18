var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (res.locals.user) {
    res.render('profile');
  } else {
    res.redirect('/')
  }
  
});

module.exports = router;