var express = require('express');
var router = express.Router();
const middlewares = require('../middlewares/middlewares')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET MAIN. */
router.get('/main',middlewares.isLogged, function(req, res, next) {
  res.render('main');
});
module.exports = router;
