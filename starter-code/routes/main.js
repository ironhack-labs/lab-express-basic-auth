// I dont understand, why I can not read the main1.ejs and the private.ejs
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const data = {
    title: 'Main'
  };
  res.render('main1', data);
});

module.exports = router;
