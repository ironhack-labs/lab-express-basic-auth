const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET main page */
router.get('/main', (req, res, next) => {
    res.render('content/main');
});

module.exports = router;
