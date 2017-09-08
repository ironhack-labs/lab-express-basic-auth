var express = require('express');
var siteRoutes = express.Router();

/* GET home page. */
siteRoutes.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = siteRoutes;
