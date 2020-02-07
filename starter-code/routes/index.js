const express = require('express');
const router  = express.Router();


router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  
  res.render('signup');
});



module.exports = router;
