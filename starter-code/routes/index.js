var express = require('express');
var router = express.Router();

function auth(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}



/* GET home page. */
router.get('/',  function(req, res, next) {
  console.log('Loading index');
  res.render('index', { title: 'Express' });
});


router.get('/secret', auth, function (req, res, next) {
  res.render('secret');
});


module.exports = router;
