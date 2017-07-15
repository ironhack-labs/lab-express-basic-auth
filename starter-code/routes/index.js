var express = require('express');
var router = express.Router();


// Render home page
router.get('/', (req, res, next) =>{
  res.send('HOME IS WHERE I BELOOOONG');
});

module.exports = router;