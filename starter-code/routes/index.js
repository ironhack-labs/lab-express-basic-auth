var express = require('express');
var router = express.Router();

function auth(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/main', auth, function (req, res, next) {
  res.render('main');
});

router.get('/private', auth, function (req, res, next) {
  res.render('private');
});

module.exports = router;
