var express = require('express');
var router = express.Router();


// Render home page
router.get('/', (req, res, next) =>{
  res.render('index');
});

module.exports = router;