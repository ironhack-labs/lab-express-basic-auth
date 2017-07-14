var express = require('express');
var router = express.Router();



router.get('/sign-up', (req, res, next) =>{
  res.render('sign-up');
});


module.exports = router;