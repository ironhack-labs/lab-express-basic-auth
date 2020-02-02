const express = require('express');
const router  = express.Router();
const auth = require('./auth');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/', auth);

module.exports = router;
