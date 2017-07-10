/*jshint esversion: 6*/
var express = require('express');
var router = express.Router();

function authorise(req, res, next) {
  if (req.session.currentUser) { next(); }
  else { res.redirect('/login'); }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/secret', authorise, (req, res, next) => {
  res.render('secret');
});

module.exports = router;
